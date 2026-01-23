import { UserService } from './../user/user.service';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerInput: RegisterInput): Promise<string> {
    const existingUser = await this.userService.findByEmail(registerInput.email);
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }
    const hashedPassword = await bcrypt.hash(registerInput.password, 10);
    await this.userService.createUser(
      registerInput.email,
      hashedPassword,
      registerInput.name,
    );
    return 'Registration successful';
  }

  async login(loginInput: LoginInput) {
    const user = await this.userService.findByEmail(loginInput.email);
    if (!user) {
      throw new NotFoundException('Email is not registered');
    }

    const isPasswordValid = await bcrypt.compare(loginInput.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    
    return this.generateToken(user);
  }

  generateToken(user: User) {
    const payload = { sub: user.userId, email: user.email };
    
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' as any,
    });

    return {
      accessToken,
      refreshToken,
    }
  }

  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.generateToken(user);
  }
}
