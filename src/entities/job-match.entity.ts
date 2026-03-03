import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CvDocument } from './cv-document.entity';
import { Job } from './job.entity';
import { User } from './user.entity';

@ObjectType()
@Entity({ tableName: 'job_matches' })
@Unique({ properties: ['cv', 'job'] })
export class JobMatch {
  @Field(() => ID)
  @PrimaryKey()
  matchId!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => CvDocument)
  cv!: CvDocument;

  @ManyToOne(() => Job)
  job!: Job;

  @Field()
  @Property({ type: 'float' })
  score!: number;

  @Property({ type: 'json', nullable: true })
  scoreBreakdownJson?: Record<string, number>;

  @Field(() => [String], { nullable: true })
  @Property({ type: 'text[]', default: [] })
  missingSkills: string[] = [];

  @Field(() => [String], { nullable: true })
  @Property({ type: 'text[]', default: [] })
  matchedSkills: string[] = [];

  @Field()
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}
