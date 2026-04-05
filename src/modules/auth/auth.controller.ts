import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { User } from "src/entities/user.entity";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(): Promise<void> {
    return;
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(
    @Req() req: { user: User },
    @Res() res: Response,
  ): Promise<void> {
    const token = this.authService.generateGoogleAccessToken(req.user);
    const frontendRedirect =
      process.env.GOOGLE_FRONTEND_REDIRECT ||
      "http://localhost:5173/auth/callback";
    res.redirect(`${frontendRedirect}?token=${encodeURIComponent(token)}`);
  }
}
