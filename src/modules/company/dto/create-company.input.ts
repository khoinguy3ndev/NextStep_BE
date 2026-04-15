import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateCompanyInput {
  @Field()
  @IsString({ message: "Company name must be a string" })
  @IsNotEmpty({ message: "Company name must not be empty" })
  name!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  website?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  industry?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  size?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  location?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  logoUrl?: string;
}
