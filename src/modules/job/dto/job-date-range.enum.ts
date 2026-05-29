import { registerEnumType } from "@nestjs/graphql";

export enum JobDateRange {
  ANY = "ANY",
  D3 = "D3",
  D7 = "D7",
  D30 = "D30",
}

registerEnumType(JobDateRange, {
  name: "JobDateRange",
});
