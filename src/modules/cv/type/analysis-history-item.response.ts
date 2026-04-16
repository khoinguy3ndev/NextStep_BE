import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AnalysisHistoryItemResponse {
  @Field(() => Int)
  analysisId!: number;

  @Field(() => Int)
  jobId!: number;

  @Field()
  jobTitle!: string;

  @Field({ nullable: true })
  cvFilename?: string;

  @Field()
  createdAt!: Date;

  @Field(() => Int, { nullable: true })
  jobMatchScore?: number;

  @Field(() => Int, { nullable: true })
  roadmapTotalWeeks?: number;
}
