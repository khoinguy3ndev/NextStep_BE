import { EntityManager } from "@mikro-orm/postgresql";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Job } from "src/entities/job.entity";
import { JobSkill } from "src/entities/job-skill.entity";
import { Skill } from "src/entities/skill.entity";
import { CreateSkillInput } from "./dto/create-skill.input";

@Injectable()
export class SkillService {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<Skill[]> {
    return this.em.find(Skill, {}, { orderBy: { name: "ASC" } });
  }

  async findSkillById(skillId: number): Promise<Skill | null> {
    return this.em.findOne(Skill, { skillId });
  }

  async createSkill(input: CreateSkillInput): Promise<Skill> {
    const normalizedName = input.name.trim();

    const existing = await this.em.findOne(Skill, { name: normalizedName });
    if (existing) {
      throw new ConflictException("Skill này đã tồn tại trong hệ thống!");
    }

    const skill = this.em.create(Skill, {
      ...input,
      name: normalizedName,
    } as any);

    await this.em.persistAndFlush(skill);
    return skill;
  }

  async updateSkill(
    skillId: number,
    data: { name?: string; category?: string; isActive?: boolean },
  ): Promise<Skill> {
    const skill = await this.findSkillById(skillId);
    if (!skill) {
      throw new NotFoundException("Không tìm thấy skill!");
    }

    if (data.name) {
      const normalizedName = data.name.trim();
      const existing = await this.em.findOne(Skill, { name: normalizedName });
      if (existing && existing.skillId !== skillId) {
        throw new ConflictException("Skill này đã tồn tại trong hệ thống!");
      }
      skill.name = normalizedName;
    }

    if (data.category !== undefined) {
      skill.category = data.category;
    }

    if (data.isActive !== undefined) {
      skill.isActive = data.isActive;
    }

    await this.em.persistAndFlush(skill);
    return skill;
  }

  async deleteSkill(skillId: number): Promise<boolean> {
    const skill = await this.findSkillById(skillId);
    if (!skill) return false;

    await this.em.removeAndFlush(skill);
    return true;
  }

  async addSkillsToJob(jobId: number, skillIds: number[]): Promise<Job> {
    const normalizedSkillIds = [...new Set(skillIds)];
    if (normalizedSkillIds.length === 0) {
      throw new BadRequestException("skillIds không được để trống");
    }

    const job = await this.em.findOne(
      Job,
      { jobId },
      { populate: ["company", "skills"] },
    );

    if (!job) {
      throw new NotFoundException("Không tìm thấy Job!");
    }

    const skills = await this.em.find(Skill, {
      skillId: { $in: normalizedSkillIds },
    });

    if (skills.length !== normalizedSkillIds.length) {
      const foundIds = new Set(skills.map((skill) => skill.skillId));
      const missingIds = normalizedSkillIds.filter((id) => !foundIds.has(id));

      throw new NotFoundException(
        `Không tìm thấy skill với id: ${missingIds.join(", ")}`,
      );
    }

    // JobSkill relation mapping pins FKs to job_job_id and skill_skill_id.
    const existingLinks = await this.em.find(JobSkill, {
      job: { jobId },
      skill: { skillId: { $in: normalizedSkillIds } },
    });

    const existingSkillIds = new Set(
      existingLinks.map((link) => link.skill.skillId),
    );

    for (const skill of skills) {
      if (existingSkillIds.has(skill.skillId)) {
        continue;
      }

      const link = this.em.create(JobSkill, {
        job,
        skill,
        importance: 1,
      } as any);

      this.em.persist(link);
    }
    await this.em.flush();

    return this.em.findOneOrFail(
      Job,
      { jobId },
      { populate: ["company", "skills"] },
    );
  }
}
