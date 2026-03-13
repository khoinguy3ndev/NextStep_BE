import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Job } from "src/entities/job.entity";
import { CreateJobInput } from "./dto/create-job.input";
import { UpdateJobInput } from "./dto/update-job.input";
import { Company } from "src/entities/company.entity";
import { JobStatus } from "src/entities/job-status.enum";

@Injectable()
export class JobService {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<Job[]> {
    // populate: ['company'] giúp lấy luôn thông tin công ty ra cùng với Job
    return this.em.find(Job, {}, { populate: ["company"] });
  }

  async findById(jobId: number): Promise<Job | null> {
    return this.em.findOne(Job, { jobId }, { populate: ["company"] });
  }

  async createJob(input: CreateJobInput): Promise<Job> {
    const { companyId, ...jobData } = input as any;

    // Kiểm tra xem Company có tồn tại không
    const company = await this.em.findOne(Company, { companyId: companyId });
    if (!company) {
      throw new NotFoundException("Không tìm thấy công ty này!");
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
      throw new NotFoundException("Không tìm thấy Job!");
    }

    // Nếu có cập nhật công ty mới
    if (companyId) {
      const company = await this.em.findOne(Company, { companyId: companyId });
      if (!company) throw new NotFoundException("Không tìm thấy công ty này!");
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
