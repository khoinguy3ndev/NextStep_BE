import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateCourseInput {
  @Field(() => Int)
  @IsInt()
  skillId!: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  provider?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  url?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  duration?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  level?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  durationHours?: number;
}
