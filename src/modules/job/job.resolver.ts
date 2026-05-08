import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { User } from "src/entities/user.entity";
import { GqlAuthGuard } from "src/modules/auth/guards/auth.guard";
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
  @UseGuards(GqlAuthGuard)
  async getJobs(
    @Args() args: GetJobsArgs,
    @CurrentUser() user: User,
  ): Promise<JobPagination> {
    return this.jobService.findAll(args, user.userId);
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
