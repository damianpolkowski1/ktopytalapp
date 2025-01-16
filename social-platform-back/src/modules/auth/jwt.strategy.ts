import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'ktopytal',
    });
  }

  async validate(payload: any) {
    // Zwracamy dane użytkownika zawarte w tokenie (np. id, email itp.)
    return { userId: payload.sub, username: payload.username };
  }
}