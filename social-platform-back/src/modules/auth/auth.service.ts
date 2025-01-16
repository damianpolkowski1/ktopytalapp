import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from '@mikro-orm/mysql';
import { User } from 'src/entities/users.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
    private readonly mailService: MailService,
  ) {}

  async validateUser(nickname: string, password: string): Promise<User> {
    const user = await this.em.findOne(User, { nickname });

    if (!user) {
      throw new UnauthorizedException(
        'Użytkownik o takiej nazwie nie istnieje',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Niepoprawne hasło');
    }

    return user;
  }

  async registerUser(
    nickname: string,
    email: string,
    password: string,
  ): Promise<User> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Podany adres e-mail jest nieprawidłowy.');
    }

    const existingUserEmail = await this.em.findOne(User, { email });
    const existingUserNickname = await this.em.findOne(User, { nickname });

    if (existingUserEmail) {
      throw new BadRequestException('Podany adres e-mail jest już w użyciu.');
    }

    if (existingUserNickname) {
      throw new BadRequestException(
        'Użytkownik o podanej nazwie użytkownika już istnieje.',
      );
    }

    // bcrypt password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.usersService.createUser(
      nickname,
      email,
      hashedPassword,
    );

    const verificationToken = this.generateVerificationToken(newUser);

    //old email sending
    // await this.mailService.sendVerificationEmail(
    //   newUser.email,
    //   'Verify Your Account',
    //   `<p>Hello ${newUser.nickname},</p>
    //    <p>Please verify your account by clicking the link below:</p>
    //    <a href="http://localhost:6565/auth/verify?token=${verificationToken}">Verify Account</a>`,
    // );
    // console.log('Email sent with Verification token:', verificationToken);
    // Generowanie linku weryfikacyjnego
    const verificationLink = `http://localhost:6565/auth/verify?token=${verificationToken}`;

    this.mailService
      .sendVerificationEmailWithTemplate(
        newUser.nickname,
        verificationLink,
        newUser.email,
      )
      .catch((error) => {
        console.error('Błąd wysyłki e-maila:', error);
      });
    return newUser;
  }

  // Generate JWT token for email verification
  generateVerificationToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.sign(payload, {
      secret: 'ktopytal_verification',
      expiresIn: '1d',
    });
  }

  // Verify email using the token
  async verifyEmail(token: string): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: 'ktopytal_verification', // Must match the secret used to sign the token
      });
      const userId = payload.sub;

      await this.usersService.verifyUser(userId);
      return true;
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification token.');
    }
  }

  async generateJWTToken(user: User) {
    const payload = {
      userId: user.id,
      email: user.email,
      nickname: user.nickname,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async generatePasswordResetToken(
    email: string,
  ): Promise<{ token: string; user: User }> {
    const user = await this.em.findOne(User, { email });
    if (!user) {
      throw new BadRequestException('Użytkownik z tym e-mailem nie istnieje.');
    }

    const payload = {
      id: user.id,
      email: user.email,
      type: 'passwordReset',
    };

    return {
      token: this.jwtService.sign(payload, {
        secret: 'ktopytal_reset_secret',
        expiresIn: '1h',
      }),
      user: user,
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: 'ktopytal_reset_secret',
      });

      if (payload.type !== 'passwordReset') {
        throw new BadRequestException('Nieprawidłowy token.');
      }
      const id = payload.id;
      const user = await this.em.findOne(User, { id });
      if (!user) {
        throw new BadRequestException('Użytkownik nie został znaleziony.');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;

      await this.usersService.updateUser(id, user);

      return { message: 'Hasło zostało pomyślnie zresetowane.' };
    } catch (error) {
      throw new BadRequestException('Nieprawidłowy lub wygasły token.');
    }
  }
}
