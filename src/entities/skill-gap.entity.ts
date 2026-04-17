import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { CvAnalysisResult } from "./cv-analysis-result.entity";
import { Skill } from "./skill.entity";

@Entity({ tableName: "skill_gaps" })
export class SkillGap {
  @PrimaryKey({ fieldName: "id" })
  id!: number;

  @ManyToOne(() => CvAnalysisResult, { fieldName: "analysis_id" })
  analysis!: CvAnalysisResult;

  @ManyToOne(() => Skill, { fieldName: "skill_id" })
  skill!: Skill;

  @Property({ fieldName: "priority_score", type: "float", default: 0 })
  priorityScore: number = 0;

  @Property({ fieldName: "gap_reason", type: "text", nullable: true })
  gapReason?: string;
}
