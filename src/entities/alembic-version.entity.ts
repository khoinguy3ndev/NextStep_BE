import { Entity, PrimaryKey } from "@mikro-orm/core";

@Entity({ tableName: "alembic_version" })
export class AlembicVersion {
  @PrimaryKey({ fieldName: "version_num" })
  versionNum!: string;
}
