import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString, IsBoolean } from "class-validator";

@InputType()
export class UpdateSkillInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: "name phải là chuỗi ký tự" })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: "category phải là chuỗi ký tự" })
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: "isActive phải là boolean" })
  isActive?: boolean;
}
