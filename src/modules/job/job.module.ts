import { Module } from "@nestjs/common";
import { JobService } from "./job.service";
import { JobResolver } from "./job.resolver";
import { CompanyModule } from "../company/company.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Job } from "src/entities/job.entity";

@Module({
  imports: [CompanyModule, MikroOrmModule.forFeature([Job])],
  providers: [JobService, JobResolver],
})
export class JobModule {}
