import { registerEnumType } from "@nestjs/graphql";

export enum JobSort {
  RELEVANCE = "RELEVANCE",
  DATE = "DATE",
}

registerEnumType(JobSort, {
  name: "JobSort",
});
