import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CvFileType {
  @Field()
  fileName!: string;

  @Field()
  contentType!: string;

  @Field()
  base64!: string;
}
