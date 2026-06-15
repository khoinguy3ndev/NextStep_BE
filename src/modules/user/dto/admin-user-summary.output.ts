import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Role } from "src/entities/role.enum";

@ObjectType()
export class AdminUserSummary {
  @Field(() => ID)
  userId!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field(() => Role)
  role!: Role;

  @Field(() => String, { nullable: true })
  avatar?: string | null;

  @Field(() => String, { nullable: true })
  currentRole?: string | null;

  @Field(() => String, { nullable: true })
  location?: string | null;

  @Field()
  createdAt!: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | null;

  @Field(() => Int)
  cvCount!: number;

  @Field(() => Int)
  scanCount!: number;
}
