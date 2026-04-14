import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { GqlAuthGuard } from "./guards/auth.guard";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./strategies/google.strategy";
import dotenv from "dotenv";

dotenv.config();

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET,
        signOptions: { expiresIn: "7d" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthResolver, GqlAuthGuard, GoogleStrategy],
  exports: [JwtModule, GqlAuthGuard],
})
export class AuthModule {}
