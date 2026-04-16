import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SkillGap } from "src/entities/skill-gap.entity";

@ObjectType()
export class AnalysisDetailResponse {
  @Field(() => Int)
  analysisId!: number;

  @Field(() => Int)
  jobId!: number;

  @Field()
  jobTitle!: string;

  @Field({ nullable: true })
  cvFilename?: string;

  @Field({ nullable: true })
  cvTextExcerpt?: string;

  @Field()
  createdAt!: Date;

  @Field()
  extractedProfileJson!: string;

  @Field()
  jobContextJson!: string;

  @Field()
  jobMatchJson!: string;

  @Field()
  gapAnalysisJson!: string;

  @Field()
  roadmapJson!: string;

  @Field(() => [SkillGap])
  skillGaps!: SkillGap[];
}
