import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "src/entities/user.entity";
import { AuthModule } from "../auth/auth.module";
import { Cv } from "src/entities/cv.entity";
import { CvAnalysisResult } from "src/entities/cv-analysis-result.entity";

@Module({
  imports: [
    MikroOrmModule.forFeature([User, Cv, CvAnalysisResult]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
