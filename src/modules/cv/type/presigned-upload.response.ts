import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PresignedUploadResponse {
  @Field()
  uploadUrl!: string;

  @Field()
  fileKey!: string;
}
