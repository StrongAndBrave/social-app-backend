import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
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
import { SessionModule } from '../session/session.module';
import { RecoveryPasswordDataRepository } from './infrastructure/recovery.password.data.repository';
import { AuthConfig } from './auth.config';
import { RecaptchaGuard } from '../../core/guards/recaptcha.guard';
import { UserModule } from '../user/user.module';
import { GoogleOAuthStrategy } from '../../core/strategies/google.oauth.strategy';
import { OAuthUserRegistrationOrLoginUseCase } from './application/use-cases/oauth-registration-user.use-case';
import { GithubOAuthStrategy } from '../../core/strategies/github.oauth.strategy';
import { EmailIsConfirmedConstraint } from '../../core/decorators/validate/email-is-confirmed.decorator';
import { ConfCodeIsValidConstraint } from '../../core/decorators/validate/confirmation-code.decorator';
import { CreateProfileUseCase } from '../profile/application/profile/create-profile.use-case';

const strategies = [
	LocalStrategy,
	JwtStrategy,
	JwtCookieStrategy,
	GoogleOAuthStrategy,
	GithubOAuthStrategy,
];

@Module({
	imports: [
		MailModule,
		PassportModule,
		SessionModule,
		JwtModule,
		UserModule,

		ThrottlerModule.forRoot([
			{
				ttl: 10000,
				limit: 5,
			},
		]),
	],
	controllers: [AuthController],
	providers: [
		{
			provide: AuthService.name,
			useClass: AuthService,
		},
		{
			provide: RecoveryPasswordDataRepository.name,
			useClass: RecoveryPasswordDataRepository,
		},
		{
			provide: AuthConfig.name,
			useClass: AuthConfig,
		},
		...strategies,
		RecaptchaGuard,
		PasswordRecoveryUseCase,
		UserRegistrationUseCase,
		OAuthUserRegistrationOrLoginUseCase,
		UserLoginUseCase,
		SetNewPasswordUseCase,
		RefreshTokensUseCase,
		RegistrationConfirmationUseCase,
		EmailIsConfirmedConstraint,
		ConfCodeIsValidConstraint,
	],
	exports: [AuthService.name],
})
export class AuthModule {}
