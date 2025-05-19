import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { MailService } from '../../../../core/adapters/mailer/mail.service';
import { OAuthUserInputModel } from '../../../user/api/models/input/oauth.user.input';
import { OAuthUserCreateCommand } from '../../../user/application/use-cases/oauth.user.cereate.use-case';
import { ProfileCreateCommand } from '../../../profile/application/profile/create-profile.use-case';

export class OAuthUserRegistrationOrLoginCommand {
	constructor(public userData: OAuthUserInputModel) {}
}

@CommandHandler(OAuthUserRegistrationOrLoginCommand)
export class OAuthUserRegistrationOrLoginUseCase
	implements ICommandHandler<OAuthUserRegistrationOrLoginCommand>
{
	constructor(
		@Inject(MailService.name) protected mailService: MailService,
		private readonly commandBus: CommandBus,
		@Inject(UserRepository.name) private readonly userRepository: UserRepository,
	) {}

	async execute(command: OAuthUserRegistrationOrLoginCommand): Promise<string | null> {
		const user = await this.userRepository.getByUnique({
			email: command.userData.email,
		});

		if (!user) {
			const addedUserId = await this.commandBus.execute(
				new OAuthUserCreateCommand(command.userData),
			);
			await this.commandBus.execute(new ProfileCreateCommand(addedUserId));
			if (!addedUserId) return null;

			const user = await this.userRepository.getByUnique({ id: addedUserId });
			if (!user) return null;

			await this.mailService.sendSuccessfulRegistrationEmail(user.email, user.username);

			return addedUserId;
		}
		return user.id;
	}
}
