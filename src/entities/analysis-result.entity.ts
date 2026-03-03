import {
  Entity,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AnalysisRequest } from './analysis-request.entity';

@ObjectType()
@Entity({ tableName: 'analysis_results' })
export class AnalysisResult {
  @Field(() => ID)
  @PrimaryKey()
  resultId!: number;

  @OneToOne(() => AnalysisRequest, { owner: true })
  request!: AnalysisRequest;

  @Field({ nullable: true })
  @Property({ type: 'text', nullable: true })
  summary?: string;

  @Property({ type: 'json', nullable: true })
  gapAnalysisJson?: Record<string, unknown>;

  @Field(() => [String], { nullable: true })
  @Property({ type: 'text[]', default: [] })
  recommendedSkills: string[] = [];

  @Property({ type: 'json', nullable: true })
  roadmapJson?: Record<string, unknown>;

  @Field()
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}
