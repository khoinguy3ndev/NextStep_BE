import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Company } from "./company.entity";
import { Currency } from "./currency.enum";
import { CvAnalysisResult } from "./cv-analysis-result.entity";
import { JobLevel } from "./job-level.enum";
import { JobRequirement } from "./job-requirement.entity";
import { JobSkill } from "./job-skill.entity";
import { JobStatus } from "./job-status.enum";
import { Roadmap } from "./roadmap.entity";
import { Skill } from "./skill.entity";

@ObjectType()
@Entity({ tableName: "jobs" })
@Unique({ properties: ["sourceUrl"] })
export class Job {
  @Field(() => ID)
  @PrimaryKey({ fieldName: "job_id" })
  jobId!: number;

  @Field(() => Company)
  @ManyToOne(() => Company, { fieldName: "company_company_id" })
  company!: Company;

  @Field()
  @Property({ fieldName: "title" })
  title!: string;

  @Field(() => JobLevel, { nullable: true })
  @Enum({
    items: () => JobLevel,
    nativeEnumName: "job_level",
    fieldName: "level",
    nullable: true,
  })
  level?: JobLevel;

  @Field({ nullable: true })
  @Property({ fieldName: "location", nullable: true })
  location?: string;

  @Field({ nullable: true })
  @Property({ fieldName: "salary_min", type: "int", nullable: true })
  salaryMin?: number;

  @Field({ nullable: true })
  @Property({ fieldName: "salary_max", type: "int", nullable: true })
  salaryMax?: number;

  @Field(() => Currency, { nullable: true })
  @Enum({
    items: () => Currency,
    nativeEnumName: "currency",
    fieldName: "currency",
    nullable: true,
  })
  currency?: Currency;

  @Field()
  @Property({ fieldName: "description_raw", type: "text" })
  descriptionRaw!: string;

  @Field({ nullable: true })
  @Property({ fieldName: "description_clean", type: "text", nullable: true })
  descriptionClean?: string;

  @Field({ nullable: true })
  @Property({ fieldName: "role_responsibilities", type: "text", nullable: true })
  roleResponsibilities?: string;

  @Field({ nullable: true })
  @Property({ fieldName: "skills_qualifications", type: "text", nullable: true })
  skillsQualifications?: string;

  @Field({ nullable: true })
  @Property({ fieldName: "benefits", type: "text", nullable: true })
  benefits?: string;

  @Field({ nullable: true })
  @Property({ fieldName: "employment_type", nullable: true })
  employmentType?: string;

  @Field({ nullable: true })
  @Property({ fieldName: "experience", nullable: true })
  experience?: string;

  @Field({ nullable: true })
  @Property({ fieldName: "application_deadline", nullable: true })
  applicationDeadline?: Date;

  @Field()
  @Property({ fieldName: "source_url" })
  sourceUrl!: string;

  @Field()
  @Property({ fieldName: "source_site" })
  sourceSite!: string;

  @Field({ nullable: true })
  @Property({ fieldName: "posted_at", nullable: true })
  postedAt?: Date;

  @Field()
  @Property({ fieldName: "scraped_at" })
  scrapedAt!: Date;

  @Field(() => JobStatus)
  @Enum({
    items: () => JobStatus,
    nativeEnumName: "job_status",
    fieldName: "status",
    default: JobStatus.ACTIVE,
  })
  status: JobStatus = JobStatus.ACTIVE;

  @OneToMany(() => JobSkill, (jobSkill) => jobSkill.job)
  jobSkills = new Collection<JobSkill>(this);

  @Field(() => [Skill])
  @ManyToMany({
    entity: () => Skill,
    inversedBy: "jobs",
    pivotEntity: () => JobSkill,
    joinColumn: "job_job_id",
    inverseJoinColumn: "skill_skill_id",
  })
  skills = new Collection<Skill>(this);

  @OneToMany(() => JobRequirement, (requirement) => requirement.job)
  requirements = new Collection<JobRequirement>(this);

  @OneToMany(() => CvAnalysisResult, (analysis) => analysis.job)
  analysisResults = new Collection<CvAnalysisResult>(this);

  @OneToMany(() => Roadmap, (roadmap) => roadmap.targetJob)
  targetRoadmaps = new Collection<Roadmap>(this);
}
