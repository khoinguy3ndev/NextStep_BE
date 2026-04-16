import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { RoadmapResourceItemResponse } from "./roadmap-resource-item.response";

@ObjectType()
export class RoadmapResourceGroupResponse {
  @Field(() => Int)
  skillId!: number;

  @Field()
  skillName!: string;

  @Field(() => Float)
  priorityScore!: number;

  @Field({ nullable: true })
  gapReason?: string;

  @Field(() => [RoadmapResourceItemResponse])
  resources!: RoadmapResourceItemResponse[];
}
