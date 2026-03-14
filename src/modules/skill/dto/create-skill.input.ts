import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateSkillInput {
  @Field()
  @IsString({ message: "name phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "name không được để trống" })
  name!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: "category phải là chuỗi ký tự" })
  category?: string;
}
