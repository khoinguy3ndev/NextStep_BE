import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Company } from './company.entity';
import { Currency } from './currency.enum';
import { JobLevel } from './job-level.enum';
import { JobStatus } from './job-status.enum';
import { JobRequirement } from './job-requirement.entity';
import { JobSkill } from './job-skill.entity';

@ObjectType()
@Entity({ tableName: 'jobs' })
export class Job {
  @Field(() => ID)
  @PrimaryKey()
  jobId!: number;

  @Field(() => Company)
  @ManyToOne(() => Company)
  company!: Company;

  @Field()
  @Property()
  title!: string;

  @Field(() => JobLevel, { nullable: true })
  @Enum({ items: () => JobLevel, nativeEnumName: 'job_level', nullable: true })
  level?: JobLevel;

  @Field({ nullable: true })
  @Property({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  @Property({ nullable: true, type: 'int' })
  salaryMin?: number;

  @Field({ nullable: true })
  @Property({ nullable: true, type: 'int' })
  salaryMax?: number;

  @Field(() => Currency, { nullable: true })
  @Enum({ items: () => Currency, nativeEnumName: 'currency', nullable: true })
  currency?: Currency;

  @Field()
  @Property({ type: 'text' })
  descriptionRaw!: string;

  @Field({ nullable: true })
  @Property({ type: 'text', nullable: true })
  descriptionClean?: string;

  @Field()
  @Property()
  @Unique()
  sourceUrl!: string;

  @Field()
  @Property()
  sourceSite!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  postedAt?: Date;

  @Field()
  @Property({ onCreate: () => new Date() })
  scrapedAt!: Date;

  @Field(() => JobStatus)
  @Enum({ items: () => JobStatus, nativeEnumName: 'job_status', default: JobStatus.ACTIVE })
  status: JobStatus = JobStatus.ACTIVE;

  @OneToMany(() => JobSkill, (jobSkill) => jobSkill.job)
  jobSkills = new Collection<JobSkill>(this);

  @OneToMany(() => JobRequirement, (requirement) => requirement.job)
  requirements = new Collection<JobRequirement>(this);
}
