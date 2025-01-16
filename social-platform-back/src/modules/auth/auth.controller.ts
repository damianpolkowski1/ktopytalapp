import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { MailService } from '../mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    return this.authService.generateJWTToken(user);
  }

  @Post('register')
  async register(
    @Body() body: { username: string; email: string; password: string },
  ) {
    const user = await this.authService.registerUser(
      body.username,
      body.email,
      body.password,
    );

    return this.authService.generateJWTToken(user);
  }
  @Get('verify')
  async verify(@Query('token') token: string, @Res() res: Response) {
    try {
      await this.authService.verifyEmail(token);
      return res
        .status(HttpStatus.OK)
        .send('Email successfully verified. You can now log in.');
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Invalid or expired verification link.');
    }
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    const data = await this.authService.generatePasswordResetToken(email);
    const resetToken = data.token;
    const user = data.user;

    const resetLink = `http://localhost:6565/reset-password?token=${resetToken}`;

    await this.mailService.sendPasswordResetEmailWithTemplate(
      user.nickname,
      resetLink,
      user.email,
    );

    return {
      message: 'Email z instrukcjami resetowania hasła został wysłany.',
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const { token, newPassword } = body;
    return await this.authService.resetPassword(token, newPassword);
  }
}
