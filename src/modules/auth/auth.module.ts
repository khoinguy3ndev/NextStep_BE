import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { GqlAuthGuard } from './guards/auth.guard';
import dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' as any },
    }),
  ],
  providers: [AuthService, AuthResolver, GqlAuthGuard],
  exports: [JwtModule, GqlAuthGuard]
})
export class AuthModule {}
