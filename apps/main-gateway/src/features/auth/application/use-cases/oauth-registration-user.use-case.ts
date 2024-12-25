import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { MailService } from '../../../../core/adapters/mailer/mail.service';
import { OAuthUserInputModel } from '../../../user/api/models/input/oauth.user.input';
import { OAuthUserCreateCommand } from '../../../user/application/use-cases/oauth.user.cereate.use-case';

export class OAuthUserRegistrationCommand {
	constructor(public userData: OAuthUserInputModel) {}
}

@CommandHandler(OAuthUserRegistrationCommand)
export class OAuthUserRegistrationUseCase
	implements ICommandHandler<OAuthUserRegistrationCommand>
{
	constructor(
		@Inject(MailService.name) protected mailService: MailService,
		private readonly commandBus: CommandBus,
		@Inject(UserRepository.name) private readonly userRepository: UserRepository,
	) {}

	async execute(command: OAuthUserRegistrationCommand): Promise<boolean> {
		const addedUserId = await this.commandBus.execute(
			new OAuthUserCreateCommand(command.userData),
		);
		if (!addedUserId) return false;

		const user = await this.userRepository.getByUnique({ id: addedUserId });
		if (!user) return false;

		await this.mailService.sendSuccessfulRegistrationEmail(
			command.userData.email,
			user.username,
		);

		return true;
	}
}
