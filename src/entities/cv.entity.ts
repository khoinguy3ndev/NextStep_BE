import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "./user.entity";

@ObjectType()
@Entity({ tableName: "cvs" })
export class Cv {
  @Field(() => ID)
  @PrimaryKey()
  cvId!: number;

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  @Field()
  @Property()
  fileName!: string;

  @Field()
  @Property({ type: "text", unique: true })
  @Unique()
  fileKey!: string;

  @Field()
  @Property({ type: "text" })
  fileUrl!: string;

  @Field()
  @Property({ onCreate: () => new Date() })
  uploadedAt!: Date;
}
