import { Module } from '@nestjs/common';
import { UserRepository } from './infrastructure/user.repository';
import { UserCreateUseCase } from './application/use-cases/user.create.use-case';
import { OAuthUserCreateUseCase } from './application/use-cases/oauth.user.cereate.use-case';
import { MailModule } from '../../core/adapters/mailer/mail.module';

@Module({
	imports: [MailModule],
	providers: [
		{
			provide: UserRepository.name,
			useClass: UserRepository,
		},
		UserCreateUseCase,
		OAuthUserCreateUseCase,
	],

	exports: [UserRepository.name, UserCreateUseCase, OAuthUserCreateUseCase],
})
export class UserModule {}
