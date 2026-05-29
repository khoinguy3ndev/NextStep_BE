import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { CvSkill } from "./cv-skill.entity";
import { Job } from "./job.entity";
import { JobRequirement } from "./job-requirement.entity";
import { JobSkill } from "./job-skill.entity";
import { RoadmapItem } from "./roadmap-item.entity";
import { SkillCourse } from "./skill-course.entity";
import { SkillGap } from "./skill-gap.entity";

@ObjectType()
@Entity({ tableName: "skills" })
@Unique({ properties: ["name"] })
export class Skill {
  @Field(() => ID)
  @PrimaryKey({ fieldName: "skill_id" })
  skillId!: number;

  @Field()
  @Property({ fieldName: "name" })
  name!: string;

  @Field({ nullable: true })
  @Property({ fieldName: "category", nullable: true })
  category?: string;

  @Field(() => [String], { nullable: true })
  @Property({ fieldName: "aliases", type: "text[]" })
  aliases: string[] = [];

  @Field()
  @Property({ fieldName: "is_active" })
  isActive!: boolean;

  @OneToMany(() => JobSkill, (jobSkill) => jobSkill.skill)
  jobSkills = new Collection<JobSkill>(this);

  @ManyToMany({
    entity: () => Job,
    mappedBy: "skills",
    pivotEntity: () => JobSkill,
  })
  jobs = new Collection<Job>(this);

  @OneToMany(() => CvSkill, (cvSkill) => cvSkill.skill)
  cvSkills = new Collection<CvSkill>(this);

  @OneToMany(() => JobRequirement, (requirement) => requirement.normalizedSkill)
  normalizedRequirements = new Collection<JobRequirement>(this);

  @OneToMany(() => RoadmapItem, (item) => item.skill)
  roadmapItems = new Collection<RoadmapItem>(this);

  @OneToMany(() => SkillCourse, (course) => course.skill)
  courses = new Collection<SkillCourse>(this);

  @OneToMany(() => SkillGap, (gap) => gap.skill)
  skillGaps = new Collection<SkillGap>(this);
}
