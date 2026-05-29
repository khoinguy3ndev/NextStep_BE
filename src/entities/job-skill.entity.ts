import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Job } from "./job.entity";
import { Skill } from "./skill.entity";

@ObjectType()
@Entity({ tableName: "job_skills" })
@Unique({ properties: ["job", "skill"] })
export class JobSkill {
  @Field(() => ID)
  @PrimaryKey({ fieldName: "job_skill_id" })
  jobSkillId!: number;

  @ManyToOne(() => Job, { fieldName: "job_job_id" })
  job!: Job;

  @ManyToOne(() => Skill, { fieldName: "skill_skill_id" })
  skill!: Skill;

  @Field()
  @Property({ fieldName: "importance", type: "float" })
  importance!: number;

  @Field({ nullable: true })
  @Property({ type: "text", nullable: true, fieldName: "evidence_snippet" })
  evidenceSnippet?: string;
}
