import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { JobService } from "./job.service";
import { Job } from "src/entities/job.entity";
import { CreateJobInput } from "./dto/create-job.input";
import { UpdateJobInput } from "./dto/update-job.input";

@Resolver(() => Job)
export class JobResolver {
  constructor(private readonly jobService: JobService) {}

  @Query(() => [Job])
  async getAllJobs(): Promise<Job[]> {
    return this.jobService.findAll();
  }

  @Query(() => Job, { nullable: true })
  async getJobById(
    @Args("jobId", { type: () => Int }) jobId: number,
  ): Promise<Job | null> {
    return this.jobService.findById(jobId);
  }

  @Mutation(() => Job)
  async createJob(@Args("input") input: CreateJobInput): Promise<Job> {
    return this.jobService.createJob(input);
  }

  @Mutation(() => Job)
  async updateJob(@Args("input") input: UpdateJobInput): Promise<Job> {
    return this.jobService.updateJob(input);
  }

  @Mutation(() => Boolean)
  async deleteJob(
    @Args("jobId", { type: () => Int }) jobId: number,
  ): Promise<boolean> {
    return this.jobService.deleteJob(jobId);
  }
}
