import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ProfileRepository } from '../../infrastructure/profile.repository';
import { ProfileEntity } from '../../domain/profile.entity';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';

export class ProfileCreateCommand {
  constructor(
    public userId: string,

  ) { }
}

@CommandHandler(ProfileCreateCommand)
export class CreateProfileUseCase implements ICommandHandler<ProfileCreateCommand> {
  constructor(
    @Inject(ProfileRepository.name) private readonly profileRepository: ProfileRepository,
  ) { }

  async execute(command: ProfileCreateCommand): Promise<string> {

    const profile = await this.profileRepository.getByUnique({ userId: command.userId });
    if (profile) throw BadRequestDomainException.create('Profile already exists');

    const newProfile = new ProfileEntity(command.userId);

    const addedProfile = await this.profileRepository.create(newProfile);

    return addedProfile.id;
  }
}
