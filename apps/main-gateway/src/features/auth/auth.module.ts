import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtModule} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserLoginUseCase } from './application/use-cases/login-user.use-case';
import { PasswordRecoveryUseCase } from './application/use-cases/password-recovery.use-case';
import { SetNewPasswordUseCase } from './application/use-cases/set-new-password.use-case';
import { RefreshTokensUseCase } from './application/use-cases/refresh-token.use-case';
import { ThrottlerModule } from '@nestjs/throttler';
import { RegistrationConfirmationUseCase } from './application/use-cases/registration-confirmation.use-case';
import { MailModule } from '../../core/adapters/mailer/mail.module';
import { LocalStrategy } from '../../core/strategies/local.strategy';
import { JwtStrategy } from '../../core/strategies/jwt.strategy';
import { JwtCookieStrategy } from '../../core/strategies/jwt.cookie.strategy';
import { UserRegistrationUseCase } from './application/use-cases/registration-user.use-case';
import { RecoveryPasswordDataRepository } from '../user/infrastructure/recovery.password.data.repository';

const strategies = [LocalStrategy, JwtStrategy, JwtCookieStrategy]

@Module({
  imports: [ MailModule, PassportModule, SessionsModule,
    JwtModule,

    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 500,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [ {
    provide: AuthService.name,
    useClass: AuthService
  },
  {
    provide: RecoveryPasswordDataRepository.name,
    useClass: RecoveryPasswordDataRepository
 }, 
  ...strategies, PasswordRecoveryUseCase, UserRegistrationUseCase, UserLoginUseCase, SetNewPasswordUseCase, RefreshTokensUseCase, RegistrationConfirmationUseCase],
   exports: [AuthService.name]
})
export class AuthModule {
}