import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../../features/auth/application/auth.service';
import { AuthConfig } from '../../features/auth/auth.config';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  constructor(@Inject(AuthService.name) private authService: AuthService,
@Inject(AuthConfig.name) private readonly authConfig: AuthConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.['refreshToken'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: authConfig.secretRefresh,
    });
  }

  async validate(payload: any) {
    // Наверное стоит проверять айди сессии и дату выпуска этой сессии, если у токена дата сессии раньше чем в бд, то не пропускаю
    const sessionId = await this.authService.sessionIsValid(payload.deviceId, payload.issuedAt);
    if (!sessionId) throw new HttpException('Unautorized', HttpStatus.UNAUTHORIZED)
    return { userId: payload.userId, deviceId: payload.deviceId };
  }
}