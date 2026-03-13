import {
  Collection,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { AiJobStatus } from './ai-job-status.enum';
import { AiJobType } from './ai-job-type.enum';
import { AnalysisRequest } from './analysis-request.entity';
import { AiJobAttempt } from './ai-job-attempt.entity';

@ObjectType()
@Entity({ tableName: 'ai_jobs' })
@Index({ properties: ['status', 'priority', 'scheduledAt'] })
@Index({ properties: ['lockedBy', 'lockedAt'] })
export class AiJob {
  @Field(() => ID)
  @PrimaryKey()
  aiJobId!: number;

  @Field(() => AiJobType)
  @Enum({ items: () => AiJobType, nativeEnumName: 'ai_job_type' })
  type!: AiJobType;

  @Field(() => AnalysisRequest, { nullable: true })
  @ManyToOne(() => AnalysisRequest, { nullable: true })
  request?: AnalysisRequest;

  @Field()
  @Property()
  entityType!: string;

  @Field(() => Int)
  @Property({ type: 'int' })
  entityId!: number;

  @Property({ type: 'json', nullable: true })
  payloadJson?: Record<string, unknown>;

  @Field(() => AiJobStatus)
  @Enum({ items: () => AiJobStatus, nativeEnumName: 'ai_job_status', default: AiJobStatus.QUEUED })
  status: AiJobStatus = AiJobStatus.QUEUED;

  @Field(() => Int)
  @Property({ type: 'int', default: 100 })
  priority: number = 100;

  @Field()
  @Property({ onCreate: () => new Date() })
  scheduledAt: Date = new Date();

  @Field(() => Int)
  @Property({ type: 'int', default: 0 })
  retryCount: number = 0;

  @Field(() => Int)
  @Property({ type: 'int', default: 3 })
  maxRetries: number = 3;

  @Field({ nullable: true })
  @Property({ nullable: true })
  lockedBy?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  lockedAt?: Date;

  @Field({ nullable: true })
  @Property({ type: 'text', nullable: true })
  errorMessage?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  startedAt?: Date;

  @Field({ nullable: true })
  @Property({ nullable: true })
  finishedAt?: Date;

  @Field()
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Field()
  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  @Field()
  @Property()
  @Unique()
  idempotencyKey!: string;

  @OneToMany(() => AiJobAttempt, (attempt) => attempt.aiJob)
  attempts = new Collection<AiJobAttempt>(this);
}
