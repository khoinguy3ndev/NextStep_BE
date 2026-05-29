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
@Unique({ properties: ["fileKey"] })
export class Cv {
  @Field(() => ID)
  @PrimaryKey({ fieldName: "cv_id" })
  cvId!: number;

  @Field(() => User)
  @ManyToOne(() => User, { fieldName: "user_user_id" })
  user!: User;

  @Field()
  @Property({ fieldName: "file_name" })
  fileName!: string;

  @Field()
  @Property({ fieldName: "file_key", type: "text" })
  fileKey!: string;

  @Field()
  @Property({ fieldName: "file_url", type: "text" })
  fileUrl!: string;

  @Field()
  @Property({ fieldName: "uploaded_at", onCreate: () => new Date() })
  uploadedAt!: Date;
}
