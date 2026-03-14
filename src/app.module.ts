import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { AppResolver } from "./app.resolver";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { AuthModule } from "./modules/auth/auth.module";
import mikroOrmConfig from "./config/mikro-orm.config";

import { UserModule } from "./modules/user/user.module";
import { JobModule } from "./modules/job/job.module";
import { CompanyModule } from "./modules/company/company.module";
import { CvModule } from "./modules/cv/cv.module";
import { SkillModule } from "src/modules/skill/skill.module";
@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: true,
    }),

    AuthModule,
    UserModule,
    JobModule,
    CompanyModule,
    CvModule,
    SkillModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
