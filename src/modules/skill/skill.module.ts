import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Company } from "src/entities/company.entity";
import { Job } from "src/entities/job.entity";
import { JobSkill } from "src/entities/job-skill.entity";
import { Skill } from "src/entities/skill.entity";
import { SkillResolver } from "./skill.resolver";
import { SkillService } from "./skill.service";

@Module({
  imports: [MikroOrmModule.forFeature([Skill, Job, JobSkill, Company])],
  providers: [SkillService, SkillResolver],
})
export class SkillModule {}
