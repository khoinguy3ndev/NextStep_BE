import { registerEnumType } from "@nestjs/graphql";

export enum JobType {
  ALL = "ALL",
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
  TEMPORARY = "TEMPORARY",
  VOLUNTEER = "VOLUNTEER",
}

registerEnumType(JobType, {
  name: "JobType",
});
