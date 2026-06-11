import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AdminCourseOutput {
  @Field(() => ID)
  courseId!: number;

  @Field()
  title!: string;

  @Field(() => String, { nullable: true })
  provider?: string | null;

  @Field(() => String, { nullable: true })
  url?: string | null;

  @Field(() => String, { nullable: true })
  duration?: string | null;

  @Field(() => String, { nullable: true })
  level?: string | null;

  @Field(() => Int, { nullable: true })
  durationHours?: number | null;

  @Field(() => Float, { nullable: true })
  rating?: number | null;

  @Field(() => String, { nullable: true })
  status?: string | null;

  @Field(() => ID, { nullable: true })
  skillId?: number | null;

  @Field(() => String, { nullable: true })
  skillName?: string | null;
}
