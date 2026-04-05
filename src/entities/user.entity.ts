import { Entity, Enum, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Role } from "./role.enum";

@ObjectType()
@Entity({ tableName: "users" })
export class User {
  @Field(() => ID)
  @PrimaryKey()
  userId!: number;

  @Field()
  @Property({ unique: true })
  @Unique()
  email!: string;

  @Property({ nullable: true })
  password?: string;

  @Field()
  @Property()
  name!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  @Property({ unique: true, nullable: true })
  @Unique()
  googleId?: string;

  @Field(() => Role)
  @Enum({ items: () => Role, default: Role.USER })
  role: Role = Role.USER;

  @Field()
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Field()
  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
