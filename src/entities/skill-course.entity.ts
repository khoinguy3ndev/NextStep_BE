import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Skill } from "./skill.entity";

@Entity({ tableName: "skill_courses" })
export class SkillCourse {
  @PrimaryKey({ fieldName: "id" })
  id!: number;

  @ManyToOne(() => Skill, { fieldName: "skill_id" })
  skill!: Skill;

  @Property({ fieldName: "platform", nullable: true })
  platform?: string;

  @Property({ fieldName: "title" })
  title!: string;

  @Property({ fieldName: "url", type: "text", nullable: true })
  url?: string;

  @Property({ fieldName: "duration", nullable: true })
  duration?: string;

  @Property({ fieldName: "level", nullable: true })
  level?: string;

  @Property({ fieldName: "duration_hours", type: "int", nullable: true })
  durationHours?: number;
}
