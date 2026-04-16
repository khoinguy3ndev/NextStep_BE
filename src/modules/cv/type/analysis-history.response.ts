import { Field, Int, ObjectType } from "@nestjs/graphql";
import { AnalysisHistoryItemResponse } from "./analysis-history-item.response";

@ObjectType()
export class AnalysisHistoryResponse {
  @Field(() => Int)
  totalCount!: number;

  @Field(() => [AnalysisHistoryItemResponse])
  items!: AnalysisHistoryItemResponse[];
}
