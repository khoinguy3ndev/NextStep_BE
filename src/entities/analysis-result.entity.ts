import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CvSkill } from './cv-skill.entity';
import { Job } from './job.entity';
import { SkillGap } from './skill-gap.entity';

@ObjectType()
@Entity({ tableName: 'cv_analysis_results' })
export class AnalysisResult {
  @Field(() => ID)
  @PrimaryKey({ fieldName: 'analysis_id' })
  analysisId!: number;

  @Field(() => Job)
  @ManyToOne(() => Job, { fieldName: 'job_job_id' })
  job!: Job;

  @Field({ nullable: true })
  @Property({ nullable: true, fieldName: 'cv_filename' })
  cvFilename?: string;

  @Field({ nullable: true })
  @Property({ type: 'text', nullable: true, fieldName: 'cv_text_excerpt' })
  cvTextExcerpt?: string;

  @Property({ type: 'json', fieldName: 'extracted_profile_json' })
  extractedProfileJson!: Record<string, unknown>;

  @Property({ type: 'json', fieldName: 'job_context_json' })
  jobContextJson!: Record<string, unknown>;

  @Property({ type: 'json', fieldName: 'job_match_json' })
  jobMatchJson!: Record<string, unknown>;

  @Property({ type: 'json', fieldName: 'gap_analysis_json' })
  gapAnalysisJson?: Record<string, unknown>;

  @Property({ type: 'json', fieldName: 'roadmap_json' })
  roadmapJson?: Record<string, unknown>;

  @Field()
  @Property({ fieldName: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => CvSkill, (cvSkill) => cvSkill.analysis)
  cvSkills = new Collection<CvSkill>(this);

  @OneToMany(() => SkillGap, (skillGap) => skillGap.analysis)
  skillGaps = new Collection<SkillGap>(this);
}
