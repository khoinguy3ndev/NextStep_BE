import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Job } from "src/entities/job.entity";
import { CreateJobInput } from "./dto/create-job.input";
import { UpdateJobInput } from "./dto/update-job.input";
import { GetJobsArgs } from "./dto/get-jobs.args";
import { JobPagination } from "./dto/job-pagination.output";
import { Company } from "src/entities/company.entity";
import { JobStatus } from "src/entities/job-status.enum";
import { JobSort } from "./dto/job-sort.enum";
import { JobDateRange } from "./dto/job-date-range.enum";
import { Cv } from "src/entities/cv.entity";
import { CvAnalysisResult } from "src/entities/cv-analysis-result.entity";

function getExperienceRangeBounds(range?: string) {
  switch (range) {
    case "UNDER_1":
      return { min: 0, max: 1 };
    case "Y1_2":
      return { min: 1, max: 3 };
    case "Y3_5":
      return { min: 3, max: 6 };
    case "Y5_PLUS":
      return { min: 5, max: null };
    default:
      return null;
  }
}

function tokenizeSearch(value?: string): string[] {
  return [
    ...new Set(
      (value || "")
        .toLowerCase()
        .split(/[^a-z0-9+#.]+/i)
        .map((token) => token.trim())
        .filter((token) => token.length >= 2),
    ),
  ].slice(0, 12);
}

function normalizeSkillName(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase();
  return normalized || null;
}

function normalizeImportance(value: unknown): number {
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0.5;
  if (numeric <= 1) return numeric;
  return Math.min(numeric / 3, 1);
}

@Injectable()
export class JobService {
  constructor(private readonly em: EntityManager) {}

  async findAll(args: GetJobsArgs, userId?: number): Promise<JobPagination> {
    const {
      search,
      location,
      level,
      minSalary,
      maxSalary,
      limit,
      offset,
      sortBy,
      dateRange,
      employmentType,
      experienceRange,
      cvId,
    } = args;

    const keywordTokens = tokenizeSearch(search);
    const cvSkills =
      cvId && userId ? await this.getLatestCvSkills(cvId, userId) : [];

    const where: string[] = ["j.status = ?"];
    const params: unknown[] = [JobStatus.ACTIVE];

    if (keywordTokens.length) {
      const searchClauses: string[] = [];

      for (const token of keywordTokens) {
        const like = `%${token}%`;
        searchClauses.push(`(
          lower(j.title) like ?
          or lower(coalesce(c.name, '')) like ?
          or lower(coalesce(j.description_clean, j.description_raw, '')) like ?
          or lower(coalesce(j.skills_qualifications, '')) like ?
          or exists (
            select 1
            from job_skills js_search
            join skills s_search on s_search.skill_id = js_search.skill_skill_id
            where js_search.job_job_id = j.job_id
              and lower(s_search.name) like ?
          )
        )`);
        params.push(like, like, like, like, like);
      }

      where.push(`(${searchClauses.join(" or ")})`);
    }

    if (location) {
      where.push(`lower(coalesce(j.location, '')) like ?`);
      params.push(`%${location.toLowerCase()}%`);
    }

    if (level) {
      where.push(`j.level = ?`);
      params.push(level);
    }

    if (minSalary !== undefined && minSalary !== null) {
      where.push(`j.salary_max >= ?`);
      params.push(minSalary);
    }

    if (maxSalary !== undefined && maxSalary !== null) {
      where.push(`j.salary_min <= ?`);
      params.push(maxSalary);
    }

    if (dateRange !== JobDateRange.ANY) {
      const days =
        dateRange === JobDateRange.D3 ? 3 : dateRange === JobDateRange.D7 ? 7 : 30;
      const threshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      where.push(`(
        j.posted_at >= ?
        or (j.posted_at is null and j.scraped_at >= ?)
      )`);
      params.push(threshold, threshold);
    }

    if (employmentType) {
      where.push(`lower(coalesce(j.employment_type, '')) like ?`);
      params.push(`%${employmentType.toLowerCase()}%`);
    }

    const experienceBounds = getExperienceRangeBounds(experienceRange);

    if (experienceBounds) {
      const normalizedExperienceSql = `trim(regexp_replace(coalesce(j.experience, ''), '[^0-9]+', ' ', 'g'))`;
      const jobExperienceMinSql =
        `nullif(split_part(${normalizedExperienceSql}, ' ', 1), '')::numeric`;
      const jobExperienceSecondSql =
        `nullif(split_part(${normalizedExperienceSql}, ' ', 2), '')::numeric`;
      const jobExperienceMaxSql = `case
        when j.experience ~ '\\+' then null
        else coalesce(${jobExperienceSecondSql}, ${jobExperienceMinSql})
      end`;

      if (experienceBounds.max == null) {
        where.push(
          `${jobExperienceMinSql} is not null and coalesce(${jobExperienceMaxSql}, ${jobExperienceMinSql}) >= ?`,
        );
        params.push(experienceBounds.min);
      } else {
        where.push(
          `${jobExperienceMinSql} is not null and ${jobExperienceMinSql} < ? and coalesce(${jobExperienceMaxSql}, ${jobExperienceMinSql}) >= ?`,
        );
        params.push(experienceBounds.max, experienceBounds.min);
      }
    }

    const whereSql = where.join(" and ");
    const countRows = await this.em.getConnection().execute(
      `
        select count(*)::int as count
        from jobs j
        left join companies c on c.company_id = j.company_company_id
        where ${whereSql}
      `,
      params,
    );
    const totalCount = Number(countRows[0]?.count || 0);

    const relevance =
      sortBy === JobSort.RELEVANCE
        ? this.buildRelevanceSql(keywordTokens, cvSkills)
        : { sql: "0", params: [] as unknown[] };

    const rows = await this.em.getConnection().execute(
      `
        select j.job_id as "jobId", ${relevance.sql} as relevance_score
        from jobs j
        left join companies c on c.company_id = j.company_company_id
        where ${whereSql}
        order by ${
          sortBy === JobSort.DATE ? "" : "relevance_score desc,"
        } j.posted_at desc nulls last, j.scraped_at desc, j.job_id desc
        limit ? offset ?
      `,
      [...relevance.params, ...params, limit, offset],
    );

    const ids = (rows as Array<{ jobId: number | string }>).map((row) =>
      Number(row.jobId),
    );
    const items = ids.length
      ? await this.em.find(
          Job,
          { jobId: { $in: ids } },
          { populate: ["company", "skills"] },
        )
      : [];

    const orderById = new Map(ids.map((id, index) => [id, index]));
    items.sort(
      (left, right) =>
        (orderById.get(left.jobId) ?? 0) - (orderById.get(right.jobId) ?? 0),
    );

    return { items, totalCount };
  }

  private buildRelevanceSql(
    keywordTokens: string[],
    cvSkills: Array<{ name: string; proficiency: number }>,
  ): { sql: string; params: unknown[] } {
    const scoreParts: string[] = [];
    const params: unknown[] = [];

    for (const token of keywordTokens) {
      const like = `%${token}%`;
      scoreParts.push(`case when lower(j.title) like ? then 30 else 0 end`);
      scoreParts.push(`case when lower(coalesce(c.name, '')) like ? then 12 else 0 end`);
      scoreParts.push(
        `case when lower(coalesce(j.description_clean, j.description_raw, '')) like ? then 4 else 0 end`,
      );
      scoreParts.push(`case when lower(coalesce(j.skills_qualifications, '')) like ? then 8 else 0 end`);
      scoreParts.push(`coalesce((
        select sum(14 * greatest(0.4, least(1, coalesce(js_keyword.importance, 0.5))))
        from job_skills js_keyword
        join skills s_keyword on s_keyword.skill_id = js_keyword.skill_skill_id
        where js_keyword.job_job_id = j.job_id
          and lower(s_keyword.name) like ?
      ), 0)`);
      params.push(like, like, like, like, like);
    }

    for (const skill of cvSkills.slice(0, 30)) {
      scoreParts.push(`coalesce((
        select sum(22 * ? * greatest(0.4, least(1, coalesce(js_cv.importance, 0.5))))
        from job_skills js_cv
        join skills s_cv on s_cv.skill_id = js_cv.skill_skill_id
        where js_cv.job_job_id = j.job_id
          and lower(s_cv.name) = ?
      ), 0)`);
      params.push(skill.proficiency, skill.name);
    }

    if (!scoreParts.length) return { sql: "0", params: [] };

    return { sql: scoreParts.join(" + "), params };
  }

  private async getLatestCvSkills(
    cvId: number,
    userId: number,
  ): Promise<Array<{ name: string; proficiency: number }>> {
    const cv = await this.em.findOne(Cv, { cvId, user: { userId } });
    if (!cv) return [];

    const analysis = await this.em.findOne(
      CvAnalysisResult,
      { cvFilename: cv.fileName },
      { orderBy: { createdAt: "DESC", analysisId: "DESC" } },
    );

    const profile = analysis?.extractedProfileJson;
    if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
      return [];
    }

    const rawSkills = (profile as { cv_skills?: unknown }).cv_skills;
    if (!Array.isArray(rawSkills)) return [];

    return rawSkills
      .map((item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          return null;
        }

        const row = item as { name?: unknown; proficiency?: unknown };
        const name = normalizeSkillName(row.name);
        if (!name) return null;

        return {
          name,
          proficiency: Math.max(0.3, Math.min(1, normalizeImportance(row.proficiency))),
        };
      })
      .filter((item): item is { name: string; proficiency: number } => item !== null);
  }

  async findById(jobId: number): Promise<Job | null> {
    return this.em.findOne(Job, { jobId }, { populate: ["company", "skills"] });
  }

  async createJob(input: CreateJobInput): Promise<Job> {
    const { companyId, ...jobData } = input as any;

    // Kiểm tra xem Company có tồn tại không
    const company = await this.em.findOne(Company, { companyId: companyId });
    if (!company) {
      throw new NotFoundException("Company not found");
    }

    // Ensure required fields are present
    const job = this.em.create(Job, {
      ...jobData,
      company: company,
      scrapedAt: new Date(),
      status: JobStatus.ACTIVE,
    });

    await this.em.persistAndFlush(job);
    return job;
  }

  async updateJob(input: UpdateJobInput): Promise<Job> {
    const { jobId, companyId, ...updateData } = input;

    const job = await this.findById(jobId);
    if (!job) {
      throw new NotFoundException("Job not found");
    }

    // Nếu có cập nhật công ty mới
    if (companyId) {
      const company = await this.em.findOne(Company, { companyId: companyId });
      if (!company) throw new NotFoundException("Company not found");
      job.company = company;
    }

    // assign sẽ tự động cập nhật các trường mới vào job hiện tại
    this.em.assign(job, updateData);
    await this.em.persistAndFlush(job);

    return job;
  }

  async deleteJob(jobId: number): Promise<boolean> {
    const job = await this.findById(jobId);
    if (!job) return false;

    await this.em.removeAndFlush(job);
    return true;
  }
}
