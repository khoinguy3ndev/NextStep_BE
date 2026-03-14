import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { JobService } from "./job.service";
import { Job } from "src/entities/job.entity";
import { CreateJobInput } from "./dto/create-job.input";
import { UpdateJobInput } from "./dto/update-job.input";
import { GetJobsArgs } from "./dto/get-jobs.args";
import { JobPagination } from "./dto/job-pagination.output";

@Resolver(() => Job)
export class JobResolver {
  constructor(private readonly jobService: JobService) {}

  @Query(() => JobPagination)
  async getJobs(@Args() args: GetJobsArgs): Promise<JobPagination> {
    return this.jobService.findAll(args);
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
