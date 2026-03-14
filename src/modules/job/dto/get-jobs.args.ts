import { ArgsType, Field, Int } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { JobLevel } from "src/entities/job-level.enum";

@ArgsType()
export class GetJobsArgs {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  search?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  location?: string;

  @IsOptional()
  @IsEnum(JobLevel)
  @Field(() => JobLevel, { nullable: true })
  level?: JobLevel;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  minSalary?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  maxSalary?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Field(() => Int, { defaultValue: 10 })
  limit: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Field(() => Int, { defaultValue: 0 })
  offset: number = 0;
}
