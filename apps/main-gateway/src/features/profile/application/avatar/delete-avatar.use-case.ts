import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';
import { AvatarRepository } from '../../infrastructure/avatar.repository';
import { ProfileRepository } from '../../infrastructure/profile.repository';

export class AvatarDeleteCommand {
	constructor(public userId: string) {}
}

@CommandHandler(AvatarDeleteCommand)
export class AvatarDeleteUseCase implements ICommandHandler<AvatarDeleteCommand> {
	constructor(
		@Inject(AvatarRepository.name) private readonly avatarRepository: AvatarRepository,
		@Inject(ProfileRepository.name) private readonly profileRepository: ProfileRepository,
	) {}

	async execute(command: AvatarDeleteCommand) {
		const profile = await this.profileRepository.getByUnique({ userId: command.userId });
		if (!profile) throw BadRequestDomainException.create('Profile already exists');
		await this.avatarRepository.softDeleteByUserId(command.userId);

		return;
	}
}
