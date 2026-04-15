import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { CreateCompanyInput } from "./create-company.input";
import { IsInt } from "class-validator";

@InputType()
export class UpdateCompanyInput extends PartialType(CreateCompanyInput) {
  @Field(() => Int)
  @IsInt({ message: "companyId must be an integer" })
  companyId!: number;
}
