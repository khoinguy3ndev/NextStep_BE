import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "src/entities/user.entity";
import { AuthModule } from "../auth/auth.module";
import { Cv } from "src/entities/cv.entity";

@Module({
  imports: [MikroOrmModule.forFeature([User, Cv]), forwardRef(() => AuthModule)],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
