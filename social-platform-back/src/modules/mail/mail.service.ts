import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmailWithTemplate(
    nickname: string,
    verificationLink: string,
    to: string,
  ) {
    const result = await this.mailerService.sendMail({
      to,
      subject: 'Zweryfikuj adres Email',
      template: 'verification',
      context: {
        nickname,
        verificationLink,
        currentYear: new Date().getFullYear(),
      },
      attachments: [
        {
          filename: 'logo_ktopytal_okrag.png',
          path: join(__dirname, 'templates', 'logo_ktopytal_okrag.png'),
          cid: 'logo_cid',
        },
      ],
    });
    return result;
  }
  async sendFollowNotificationEmail(
    followedNickname: string,
    followerNickname: string,
    followerProfileLink: string,
    to: string,
  ) {
    await this.mailerService.sendMail({
      to,
      subject: `Masz nowego obserwatora!`,
      template: 'follow-notification',
      context: {
        followedNickname,
        followerNickname,
        followerProfileLink,
        currentYear: new Date().getFullYear(),
      },
      attachments: [
        {
          filename: 'logo_ktopytal_okrag.png',
          path: join(__dirname, 'templates', 'logo_ktopytal_okrag.png'),
          cid: 'logo_cid',
        },
      ],
    });
  }
  async sendPasswordResetEmailWithTemplate(
    nickname: string,
    resetLink: string,
    to: string,
  ) {
    await this.mailerService.sendMail({
      to,
      subject: 'Resetowanie Hasła',
      template: 'password-reset',
      context: {
        nickname,
        resetLink,
        currentYear: new Date().getFullYear(),
      },
      attachments: [
        {
          filename: 'logo_ktopytal_okrag.png',
          path: join(__dirname, 'templates', 'logo_ktopytal_okrag.png'),
          cid: 'logo_cid',
        },
      ],
    });
  }
}
