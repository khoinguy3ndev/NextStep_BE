import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString, IsBoolean } from "class-validator";

@InputType()
export class UpdateSkillInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: "name must be a string" })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: "category must be a string" })
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: "isActive must be a boolean" })
  isActive?: boolean;
}
