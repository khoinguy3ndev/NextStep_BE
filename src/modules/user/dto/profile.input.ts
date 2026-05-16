import { Field, Float, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export enum SuggestedImprovementStatus {
  done = "done",
  warning = "warning",
  todo = "todo",
}

export enum ExperienceType {
  WORK = "WORK",
  INTERNSHIP = "INTERNSHIP",
  PROJECT = "PROJECT",
  FREELANCE = "FREELANCE",
  EDUCATION = "EDUCATION",
}

export enum WorkStyle {
  ONSITE = "ONSITE",
  HYBRID = "HYBRID",
  REMOTE = "REMOTE",
  HYBRID_OR_REMOTE = "HYBRID_OR_REMOTE",
}

registerEnumType(SuggestedImprovementStatus, {
  name: "SuggestedImprovementStatus",
});

registerEnumType(ExperienceType, {
  name: "ExperienceType",
});

registerEnumType(WorkStyle, {
  name: "WorkStyle",
});

@ObjectType()
@InputType("SuggestedImprovementInput")
export class SuggestedImprovement {
  @Field()
  @IsString()
  id!: string;

  @Field()
  @IsString()
  title!: string;

  @Field(() => SuggestedImprovementStatus)
  @IsEnum(SuggestedImprovementStatus)
  status!: SuggestedImprovementStatus;
}

@ObjectType()
@InputType("ProfileExperienceInput")
export class ProfileExperience {
  @Field()
  @IsString()
  id!: string;

  @Field()
  @IsString()
  title!: string;

  @Field()
  @IsString()
  organization!: string;

  @Field(() => ExperienceType)
  @IsEnum(ExperienceType)
  type!: ExperienceType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  startDate?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  endDate?: string | null;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[] | null;
}

@ObjectType()
@InputType("CareerGoalsInput")
export class CareerGoals {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  targetRole?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  preferredLocation?: string | null;

  @Field(() => WorkStyle, { nullable: true })
  @IsOptional()
  @IsEnum(WorkStyle)
  workStyle?: WorkStyle | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  goal?: string | null;
}

@InputType()
export class UpdateUserProfileInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  currentRole?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  location?: string | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  experienceYears?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  targetSalaryMin?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  targetSalaryMax?: number | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  phone?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  githubUrl?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  linkedinUrl?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  portfolioUrl?: string | null;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[] | null;

  @Field(() => [SuggestedImprovement], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SuggestedImprovement)
  suggestedImprovements?: SuggestedImprovement[] | null;

  @Field(() => [ProfileExperience], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfileExperience)
  experiences?: ProfileExperience[] | null;

  @Field(() => CareerGoals, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => CareerGoals)
  careerGoals?: CareerGoals | null;
}
