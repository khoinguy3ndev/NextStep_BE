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
  @IsInt({ message: "companyId phải là số nguyên" })
  companyId!: number; // Gửi ID của Company lên thay vì cả object

  @Field()
  @IsString({ message: "title phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "title không được để trống" })
  title!: string;

  @Field(() => JobLevel, { nullable: true })
  @IsOptional()
  @IsEnum(JobLevel, { message: "level không hợp lệ" })
  level?: JobLevel;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: "location phải là chuỗi ký tự" })
  location?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: "salaryMin phải là số nguyên" })
  salaryMin?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: "salaryMax phải là số nguyên" })
  salaryMax?: number;

  @Field(() => Currency, { nullable: true })
  @IsOptional()
  @IsEnum(Currency, { message: "currency không hợp lệ" })
  currency?: Currency;

  @Field()
  @IsString({ message: "descriptionRaw phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "descriptionRaw không được để trống" })
  descriptionRaw!: string;

  @Field()
  @IsString({ message: "sourceUrl phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "sourceUrl không được để trống" })
  @IsUrl({}, { message: "sourceUrl phải là URL hợp lệ" })
  sourceUrl!: string;

  @Field()
  @IsString({ message: "sourceSite phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "sourceSite không được để trống" })
  sourceSite!: string;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: "postedAt phải là kiểu ngày hợp lệ" })
  postedAt?: Date;
}
