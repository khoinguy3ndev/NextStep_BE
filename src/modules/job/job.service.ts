import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { QueryOrder } from "@mikro-orm/core";
import { Job } from "src/entities/job.entity";
import { CreateJobInput } from "./dto/create-job.input";
import { UpdateJobInput } from "./dto/update-job.input";
import { GetJobsArgs } from "./dto/get-jobs.args";
import { JobPagination } from "./dto/job-pagination.output";
import { Company } from "src/entities/company.entity";
import { JobStatus } from "src/entities/job-status.enum";
import { JobSort } from "./dto/job-sort.enum";
import { JobDateRange } from "./dto/job-date-range.enum";

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

@Injectable()
export class JobService {
  constructor(private readonly em: EntityManager) {}

  async findAll(args: GetJobsArgs): Promise<JobPagination> {
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
    } = args;

    const qb = this.em
      .createQueryBuilder(Job, "j")
      .leftJoinAndSelect("j.company", "c");

    if (search) {
      qb.andWhere({
        $or: [
          { title: { $ilike: `%${search}%` } },
          { company: { name: { $ilike: `%${search}%` } } },
        ],
      });
    }

    if (location) {
      qb.andWhere({ location: { $ilike: `%${location}%` } });
    }

    if (level) {
      qb.andWhere({ level });
    }

    if (minSalary !== undefined && minSalary !== null) {
      qb.andWhere({ salaryMax: { $gte: minSalary } });
    }

    if (maxSalary !== undefined && maxSalary !== null) {
      qb.andWhere({ salaryMin: { $lte: maxSalary } });
    }

    if (dateRange !== JobDateRange.ANY) {
      const days = dateRange === JobDateRange.D3 ? 3 : dateRange === JobDateRange.D7 ? 7 : 30;
      const threshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      qb.andWhere({
        $or: [
          { postedAt: { $gte: threshold } },
          { postedAt: null, scrapedAt: { $gte: threshold } },
        ],
      });
    }

    if (employmentType) {
      qb.andWhere({ employmentType: { $ilike: `%${employmentType}%` } });
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
        qb.andWhere(
          `${jobExperienceMinSql} is not null and coalesce(${jobExperienceMaxSql}, ${jobExperienceMinSql}) >= ${experienceBounds.min}`,
        );
      } else {
        qb.andWhere(
          `${jobExperienceMinSql} is not null and ${jobExperienceMinSql} < ${experienceBounds.max} and coalesce(${jobExperienceMaxSql}, ${jobExperienceMinSql}) >= ${experienceBounds.min}`,
        );
      }
    }

    const orderBy =
      sortBy === JobSort.DATE
        ? { postedAt: QueryOrder.DESC, scrapedAt: QueryOrder.DESC }
        : { scrapedAt: QueryOrder.DESC, postedAt: QueryOrder.DESC };

    const [items, totalCount] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    await this.em.populate(items, ["skills"]);

    return { items, totalCount };
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
