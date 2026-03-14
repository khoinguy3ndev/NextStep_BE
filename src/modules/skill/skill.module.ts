import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Job } from "src/entities/job.entity";
import { Skill } from "src/entities/skill.entity";
import { SkillResolver } from "./skill.resolver";
import { SkillService } from "./skill.service";

@Module({
  imports: [MikroOrmModule.forFeature([Skill, Job])],
  providers: [SkillService, SkillResolver],
})
export class SkillModule {}
