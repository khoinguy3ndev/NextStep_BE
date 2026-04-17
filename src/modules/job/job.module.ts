import { Module } from "@nestjs/common";
import { JobService } from "./job.service";
import { JobResolver } from "./job.resolver";
import { CompanyModule } from "../company/company.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Company } from "src/entities/company.entity";
import { JobSkill } from "src/entities/job-skill.entity";
import { Job } from "src/entities/job.entity";
import { Skill } from "src/entities/skill.entity";

@Module({
  imports: [
    CompanyModule,
    MikroOrmModule.forFeature([Job, Company, Skill, JobSkill]),
  ],
  providers: [JobService, JobResolver],
})
export class JobModule {}
