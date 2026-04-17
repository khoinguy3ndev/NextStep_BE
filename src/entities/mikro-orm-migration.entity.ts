import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "mikro_orm_migrations" })
export class MikroOrmMigration {
  @PrimaryKey({ fieldName: "id" })
  id!: number;

  @Property({ fieldName: "name", nullable: true })
  name?: string;

  @Property({ fieldName: "executed_at", nullable: true })
  executedAt?: Date;
}
