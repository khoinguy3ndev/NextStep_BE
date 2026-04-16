import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AnalysisResult } from './analysis-result.entity';
import { Skill } from './skill.entity';

@ObjectType()
@Entity({ tableName: 'skill_gaps' })
@Unique({ properties: ['analysis', 'skill'] })
export class SkillGap {
  @Field(() => ID)
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => AnalysisResult, { fieldName: 'analysis_id' })
  analysis!: AnalysisResult;

  @Field(() => Skill)
  @ManyToOne(() => Skill, { fieldName: 'skill_id' })
  skill!: Skill;

  @Field()
  @Property({ type: 'float', fieldName: 'priority_score' })
  priorityScore!: number;

  @Field({ nullable: true })
  @Property({ type: 'text', nullable: true, fieldName: 'gap_reason' })
  gapReason?: string;
}
