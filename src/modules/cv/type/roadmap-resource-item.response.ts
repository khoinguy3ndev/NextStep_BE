import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RoadmapResourceItemResponse {
  @Field(() => Int)
  id!: number;

  @Field()
  title!: string;

  @Field({ nullable: true })
  platform?: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  duration?: string;

  @Field(() => Int, { nullable: true })
  durationHours?: number;

  @Field({ nullable: true })
  level?: string;
}
