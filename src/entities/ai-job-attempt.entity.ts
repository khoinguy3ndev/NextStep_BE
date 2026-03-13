import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { AiJob } from './ai-job.entity';
import { AiJobStatus } from './ai-job-status.enum';

@ObjectType()
@Entity({ tableName: 'ai_job_attempts' })
export class AiJobAttempt {
  @Field(() => ID)
  @PrimaryKey()
  attemptId!: number;

  @Field(() => AiJob)
  @ManyToOne(() => AiJob)
  aiJob!: AiJob;

  @Field(() => Int)
  @Property({ type: 'int' })
  attemptNo!: number;

  @Field(() => AiJobStatus)
  @Enum({ items: () => AiJobStatus, nativeEnumName: 'ai_job_status' })
  status!: AiJobStatus;

  @Field()
  @Property({ onCreate: () => new Date() })
  startedAt!: Date;

  @Field({ nullable: true })
  @Property({ nullable: true })
  finishedAt?: Date;

  @Field({ nullable: true })
  @Property({ nullable: true })
  workerId?: string;

  @Property({ type: 'json', nullable: true })
  inputSnapshotJson?: Record<string, unknown>;

  @Property({ type: 'json', nullable: true })
  outputSnapshotJson?: Record<string, unknown>;

  @Field({ nullable: true })
  @Property({ type: 'text', nullable: true })
  errorMessage?: string;

  @Field(() => Int, { nullable: true })
  @Property({ type: 'int', nullable: true })
  latencyMs?: number;

  @Field(() => Int, { nullable: true })
  @Property({ type: 'int', nullable: true })
  promptTokens?: number;

  @Field(() => Int, { nullable: true })
  @Property({ type: 'int', nullable: true })
  completionTokens?: number;

  @Field({ nullable: true })
  @Property({ type: 'float', nullable: true })
  costUsd?: number;
}
