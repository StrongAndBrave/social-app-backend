import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { ProfileCreateCommand } from '../../../profile/application/profile/create-profile.use-case';

export class RegistrationConfirmationCommand {
	constructor(public code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase
	implements ICommandHandler<RegistrationConfirmationCommand>
{
	constructor(
		@Inject(UserRepository.name) private readonly userRepository: UserRepository,
		private readonly commandBus: CommandBus,
	) {}

	async execute(command: RegistrationConfirmationCommand): Promise<boolean> {
		const user = await this.userRepository.getByUnique({
			confirmationCode: command.code,
		});
		if (!user) throw NotFoundDomainException.create('User not found');

		await this.userRepository.update({
			where: { id: user.id },
			data: { isConfirmed: true },
		});

		await this.commandBus.execute(new ProfileCreateCommand(user.id));

		return true;
	}
}
