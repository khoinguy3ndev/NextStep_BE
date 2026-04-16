import { MikroOrmModule } from "@mikro-orm/nestjs";
import { S3Client } from "@aws-sdk/client-s3";
import { Module } from "@nestjs/common";
import { AnalysisResult } from "src/entities/analysis-result.entity";
import { Cv } from "src/entities/cv.entity";
import { CvSkill } from "src/entities/cv-skill.entity";
import { Job } from "src/entities/job.entity";
import { Skill } from "src/entities/skill.entity";
import { SkillCourse } from "src/entities/skill-course.entity";
import { SkillGap } from "src/entities/skill-gap.entity";
import { AuthModule } from "src/modules/auth/auth.module";
import { CvResolver } from "./cv.resolver";
import { CvService } from "./cv.service";

@Module({
  imports: [
    AuthModule,
    MikroOrmModule.forFeature([
      Cv,
      AnalysisResult,
      CvSkill,
      SkillGap,
      SkillCourse,
      Job,
      Skill,
    ]),
  ],
  providers: [
    {
      provide: S3Client,
      useFactory: () => {
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        const endpoint = process.env.R2_ENDPOINT;

        if (!accessKeyId || !secretAccessKey || !endpoint) {
          throw new Error(
            "Cloudflare R2 environment variables are not fully configured",
          );
        }

        return new S3Client({
          region: "auto",
          endpoint,
          forcePathStyle: true,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });
      },
    },
    CvService,
    CvResolver,
  ],
  exports: [CvService],
})
export class CvModule {}
