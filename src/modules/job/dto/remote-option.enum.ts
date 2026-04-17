import { registerEnumType } from "@nestjs/graphql";

export enum RemoteOption {
  ALL = "ALL",
  ON_SITE = "ON_SITE",
  HYBRID = "HYBRID",
  REMOTE = "REMOTE",
}

registerEnumType(RemoteOption, {
  name: "RemoteOption",
});
