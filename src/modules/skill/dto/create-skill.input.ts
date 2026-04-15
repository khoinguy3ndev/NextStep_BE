import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateSkillInput {
  @Field()
  @IsString({ message: "name must be a string" })
  @IsNotEmpty({ message: "name must not be empty" })
  name!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: "category must be a string" })
  category?: string;
}
