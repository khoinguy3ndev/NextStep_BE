import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { CvAnalysisResult } from './cv-analysis-result.entity';
import { Skill } from './skill.entity';

@Entity({ tableName: 'cv_skills' })
export class CvSkill {
  @PrimaryKey({ fieldName: 'id' })
  id!: number;

  @ManyToOne(() => CvAnalysisResult, { fieldName: 'analysis_id' })
  analysis!: CvAnalysisResult;

  @ManyToOne(() => Skill, { fieldName: 'skill_id' })
  skill!: Skill;

  @Property({ fieldName: 'confidence', type: 'float', default: 0.5 })
  confidence: number = 0.5;

  @Property({ fieldName: 'source', nullable: true })
  source?: string;
}
