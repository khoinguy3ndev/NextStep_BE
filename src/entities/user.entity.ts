import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";
import { Cv } from "./cv.entity";
import { Role } from "./role.enum";
import { Roadmap } from "./roadmap.entity";
import { SearchProfile } from "./search-profile.entity";
import {
  CareerGoals,
  ProfileExperience,
  SuggestedImprovement,
} from "../modules/user/dto/profile.input";

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

  @Field(() => String, { nullable: true })
  @Property({ fieldName: "avatar", nullable: true })
  avatar?: string | null;

  @Field(() => String, { nullable: true })
  @Property({ fieldName: "google_id", nullable: true })
  googleId?: string | null;

  @Field(() => String, { nullable: true })
  @Property({ fieldName: "current_role", nullable: true })
  currentRole?: string | null;

  @Field(() => String, { nullable: true })
  @Property({ fieldName: "location", nullable: true })
  location?: string | null;

  @Field(() => Float, { nullable: true })
  @Property({ fieldName: "experience_years", nullable: true })
  experienceYears?: number | null;

  @Field(() => Float, { nullable: true })
  @Property({ fieldName: "target_salary_min", nullable: true })
  targetSalaryMin?: number | null;

  @Field(() => Float, { nullable: true })
  @Property({ fieldName: "target_salary_max", nullable: true })
  targetSalaryMax?: number | null;

  @Field(() => String, { nullable: true })
  @Property({ fieldName: "phone", nullable: true })
  phone?: string | null;

  @Field(() => String, { nullable: true })
  @Property({ fieldName: "github_url", nullable: true })
  githubUrl?: string | null;

  @Field(() => String, { nullable: true })
  @Property({ fieldName: "linkedin_url", nullable: true })
  linkedinUrl?: string | null;

  @Field(() => String, { nullable: true })
  @Property({ fieldName: "portfolio_url", nullable: true })
  portfolioUrl?: string | null;

  @Field(() => [String], { nullable: true })
  @Property({ fieldName: "skills", type: "text[]", nullable: true })
  skills?: string[] | null;

  @Field(() => [SuggestedImprovement], { nullable: true })
  @Property({
    fieldName: "suggested_improvements",
    type: "json",
    nullable: true,
  })
  suggestedImprovements?: SuggestedImprovement[] | null;

  @Field(() => [ProfileExperience], { nullable: true })
  @Property({ fieldName: "experiences", type: "json", nullable: true })
  experiences?: ProfileExperience[] | null;

  @Field(() => CareerGoals, { nullable: true })
  @Property({ fieldName: "career_goals", type: "json", nullable: true })
  careerGoals?: CareerGoals | null;

  @Field(() => Role)
  @Enum({ items: () => Role, fieldName: "role", default: Role.USER })
  role: Role = Role.USER;

  @Field()
  @Property({ fieldName: "created_at" })
  createdAt!: Date;

  @Field({ nullable: true })
  @Property({ fieldName: "updated_at", nullable: true })
  updatedAt?: Date;

  @Field(() => Int, { nullable: true })
  @Property({ fieldName: "base_cv_id", nullable: true })
  baseCvId?: number | null;

  @OneToMany(() => Cv, (cv) => cv.user)
  cvs = new Collection<Cv>(this);

  @OneToMany(() => Roadmap, (roadmap) => roadmap.user)
  roadmaps = new Collection<Roadmap>(this);

  @OneToMany(() => SearchProfile, (profile) => profile.user)
  searchProfiles = new Collection<SearchProfile>(this);
}
