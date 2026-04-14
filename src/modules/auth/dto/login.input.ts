import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { IsEmail } from "class-validator";

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsNotEmpty()
  password!: string;
}
