import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Company } from "src/entities/company.entity";
import { Job } from "src/entities/job.entity";
import { JobSkill } from "src/entities/job-skill.entity";
import { SkillCourse } from "src/entities/skill-course.entity";
import { Skill } from "src/entities/skill.entity";
import { SkillResolver } from "./skill.resolver";
import { SkillService } from "./skill.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([Skill, Job, JobSkill, Company, SkillCourse]),
  ],
  providers: [SkillService, SkillResolver],
})
export class SkillModule {}
