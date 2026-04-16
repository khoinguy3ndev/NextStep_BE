import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { CvSkill } from "./cv-skill.entity";
import { Job } from "./job.entity";
import { JobSkill } from "./job-skill.entity";
import { RoadmapItem } from "./roadmap-item.entity";
import { SkillCourse } from "./skill-course.entity";
import { SkillGap } from "./skill-gap.entity";

@ObjectType()
@Entity({ tableName: "skills" })
export class Skill {
  @Field(() => ID)
  @PrimaryKey()
  skillId!: number;

  @Field()
  @Property({ unique: true })
  name!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  category?: string;

  @Field(() => [String], { nullable: true })
  @Property({ type: "text[]", default: [] })
  aliases: string[] = [];

  @Field()
  @Property({ default: true })
  isActive!: boolean;

  @OneToMany(() => JobSkill, (jobSkill) => jobSkill.skill)
  jobSkills = new Collection<JobSkill>(this);

  @ManyToMany({ entity: () => Job, mappedBy: "skills" })
  jobs = new Collection<Job>(this);

  @OneToMany(() => CvSkill, (cvSkill) => cvSkill.skill)
  cvSkills = new Collection<CvSkill>(this);

  @OneToMany(() => SkillGap, (skillGap) => skillGap.skill)
  skillGaps = new Collection<SkillGap>(this);

  @OneToMany(() => SkillCourse, (skillCourse) => skillCourse.skill)
  skillCourses = new Collection<SkillCourse>(this);

  @OneToMany(() => RoadmapItem, (item) => item.skill)
  roadmapItems = new Collection<RoadmapItem>(this);
}
