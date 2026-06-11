import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { IsInt } from "class-validator";
import { CreateCourseInput } from "./create-course.input";

@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {
  @Field(() => Int)
  @IsInt()
  courseId!: number;
}
