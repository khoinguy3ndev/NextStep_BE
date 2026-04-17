import { registerEnumType } from "@nestjs/graphql";

export enum JobLevel {
  Intern = "intern",
  Junior = "junior",
  Mid = "mid",
  Senior = "senior",
  Lead = "lead",
}

registerEnumType(JobLevel, {
  name: "JobLevel",
});
