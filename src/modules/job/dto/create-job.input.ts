import { Field, InputType, Int } from "@nestjs/graphql";
import { JobLevel } from "src/entities/job-level.enum";
import { Currency } from "src/entities/currency.enum";
import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

@InputType()
export class CreateJobInput {
  @Field(() => Int)
  @IsInt({ message: "companyId must be an integer" })
  companyId!: number; // Gửi ID của Company lên thay vì cả object

  @Field()
  @IsString({ message: "title must be a string" })
  @IsNotEmpty({ message: "title must not be empty" })
  title!: string;

  @Field(() => JobLevel, { nullable: true })
  @IsOptional()
  @IsEnum(JobLevel, { message: "level is invalid" })
  level?: JobLevel;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: "location must be a string" })
  location?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: "salaryMin must be an integer" })
  salaryMin?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: "salaryMax must be an integer" })
  salaryMax?: number;

  @Field(() => Currency, { nullable: true })
  @IsOptional()
  @IsEnum(Currency, { message: "currency is invalid" })
  currency?: Currency;

  @Field()
  @IsString({ message: "descriptionRaw must be a string" })
  @IsNotEmpty({ message: "descriptionRaw must not be empty" })
  descriptionRaw!: string;

  @Field()
  @IsString({ message: "sourceUrl must be a string" })
  @IsNotEmpty({ message: "sourceUrl must not be empty" })
  @IsUrl({}, { message: "sourceUrl must be a valid URL" })
  sourceUrl!: string;

  @Field()
  @IsString({ message: "sourceSite must be a string" })
  @IsNotEmpty({ message: "sourceSite must not be empty" })
  sourceSite!: string;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: "postedAt must be a valid date" })
  postedAt?: Date;
}
