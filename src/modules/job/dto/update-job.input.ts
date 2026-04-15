import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { CreateJobInput } from "./create-job.input";
import { JobStatus } from "src/entities/job-status.enum";
import { IsEnum, IsInt, IsOptional } from "class-validator";

// PartialType giúp kế thừa toàn bộ trường của CreateJobInput nhưng chuyển thành không bắt buộc (optional)
@InputType()
export class UpdateJobInput extends PartialType(CreateJobInput) {
  @Field(() => Int)
  @IsInt({ message: "jobId must be an integer" })
  jobId!: number;

  @Field(() => JobStatus, { nullable: true })
  @IsOptional()
  @IsEnum(JobStatus, { message: "status is invalid" })
  status?: JobStatus;
}
