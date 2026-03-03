import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Job } from './job.entity';
import { Skill } from './skill.entity';

@ObjectType()
@Entity({ tableName: 'job_skills' })
@Unique({ properties: ['job', 'skill'] })
export class JobSkill {
  @Field(() => ID)
  @PrimaryKey()
  jobSkillId!: number;

  @ManyToOne(() => Job)
  job!: Job;

  @ManyToOne(() => Skill)
  skill!: Skill;

  @Field()
  @Property({ type: 'float' })
  importance!: number;

  @Field({ nullable: true })
  @Property({ type: 'text', nullable: true })
  evidenceSnippet?: string;
}
