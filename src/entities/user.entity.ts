import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Cv } from "./cv.entity";
import { Role } from "./role.enum";
import { Roadmap } from "./roadmap.entity";
import { SearchProfile } from "./search-profile.entity";

@ObjectType()
@Entity({ tableName: "users" })
@Unique({ properties: ["email"] })
@Unique({ properties: ["googleId"] })
export class User {
  @Field(() => ID)
  @PrimaryKey({ fieldName: "user_id" })
  userId!: number;

  @Field()
  @Property({ fieldName: "email" })
  email!: string;

  @Property({ fieldName: "password", nullable: true })
  password?: string;

  @Field()
  @Property({ fieldName: "name" })
  name!: string;

  @Field({ nullable: true })
  @Property({ fieldName: "avatar", nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  @Property({ fieldName: "google_id", nullable: true })
  googleId?: string;

  @Field(() => Role)
  @Enum({ items: () => Role, fieldName: "role", default: Role.USER })
  role: Role = Role.USER;

  @Field()
  @Property({ fieldName: "created_at" })
  createdAt!: Date;

  @Field({ nullable: true })
  @Property({ fieldName: "updated_at", nullable: true })
  updatedAt?: Date;

  @OneToMany(() => Cv, (cv) => cv.user)
  cvs = new Collection<Cv>(this);

  @OneToMany(() => Roadmap, (roadmap) => roadmap.user)
  roadmaps = new Collection<Roadmap>(this);

  @OneToMany(() => SearchProfile, (profile) => profile.user)
  searchProfiles = new Collection<SearchProfile>(this);
}
