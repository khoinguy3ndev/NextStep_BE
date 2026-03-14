import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Job } from "src/entities/job.entity";

@ObjectType()
export class JobPagination {
  @Field(() => [Job])
  items: Job[];

  @Field(() => Int)
  totalCount: number;
}
