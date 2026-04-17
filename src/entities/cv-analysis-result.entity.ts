import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Job } from "./job.entity";
import { CvSkill } from "./cv-skill.entity";
import { SkillGap } from "./skill-gap.entity";

@Entity({ tableName: "cv_analysis_results" })
export class CvAnalysisResult {
  @PrimaryKey({ fieldName: "analysis_id" })
  analysisId!: number;

  @ManyToOne(() => Job, { fieldName: "job_job_id" })
  job!: Job;

  @Property({ fieldName: "cv_filename", nullable: true })
  cvFilename?: string;

  @Property({ fieldName: "cv_text_excerpt", type: "text", nullable: true })
  cvTextExcerpt?: string;

  @Property({ fieldName: "extracted_profile_json", type: "json" })
  extractedProfileJson!: Record<string, unknown>;

  @Property({ fieldName: "job_context_json", type: "json" })
  jobContextJson!: Record<string, unknown>;

  @Property({ fieldName: "job_match_json", type: "json" })
  jobMatchJson!: Record<string, unknown>;

  @Property({ fieldName: "gap_analysis_json", type: "json" })
  gapAnalysisJson!: Record<string, unknown>;

  @Property({ fieldName: "roadmap_json", type: "json" })
  roadmapJson!: Record<string, unknown>;

  @Property({ fieldName: "created_at" })
  createdAt!: Date;

  @OneToMany(() => CvSkill, (cvSkill) => cvSkill.analysis)
  cvSkills = new Collection<CvSkill>(this);

  @OneToMany(() => SkillGap, (skillGap) => skillGap.analysis)
  skillGaps = new Collection<SkillGap>(this);
}
