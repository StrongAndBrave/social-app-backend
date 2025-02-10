import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ProfileRepository } from '../../infrastructure/profile.repository';
import { ProfileEntity } from '../../domain/profile.entity';
import { BadRequestDomainException, NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import sharp from 'sharp';
import { FilesClientService } from '../../../../core/utils/files-microservice-connection/client-service';
import { AvatarRepository } from '../../infrastructure/avatar.repository';
import { AvatarEntity } from '../../domain/avatar.entity';

export class AddAvatarCommand {
  constructor(
    public userId: string,
    public avatarBuffer: Buffer

  ) { }
}

@CommandHandler(AddAvatarCommand)
export class AddAvatarUseCase implements ICommandHandler<AddAvatarCommand> {
  constructor(
    @Inject(ProfileRepository.name) private readonly profileRepository: ProfileRepository,
    @Inject(AvatarRepository.name) private readonly avatarRepository: AvatarRepository,
    @Inject(FilesClientService.name) private readonly filesClientService: FilesClientService,
  ) { }

  async execute(command: AddAvatarCommand) {

    const avatar = sharp(command.avatarBuffer).resize(192, 192).toFormat('png');
    const avatarBuffer = await avatar.toBuffer();

    const avatarMetadata = await sharp(avatarBuffer).metadata();
    const avatarFileSize = avatarMetadata.size;

    const avatarThumbnail = sharp(command.avatarBuffer).resize(45, 45).toFormat('png');
    const avatarThumbnailBuffer = await avatarThumbnail.toBuffer();

    const avatarThumbnailMetadata = await sharp(avatarThumbnailBuffer).metadata();
    const avatarThumbnailSize = avatarThumbnailMetadata.size;

    const AvatarUrl = await this.filesClientService.uploadFile({ userId: command.userId, image: avatarBuffer })

    if (!AvatarUrl) {
      throw new Error('Avatar failed to upload');
    }

    const avatarThumbnailUrl = await this.filesClientService.uploadFile({ userId: command.userId, image: avatarThumbnailBuffer })

    if (!avatarThumbnailUrl) {
      throw new Error('Avatar thumbnail failed to upload');
    }

    const profile = await this.profileRepository.getByUnique({ userId: command.userId });
    if (!profile) throw NotFoundDomainException.create('Profile not found');

    const avatarData = {
      profileId: profile.id,
      url: AvatarUrl,
      fileSize: avatarFileSize ?? 0,
      width: avatarMetadata.width ?? 0,
      height: avatarMetadata.height ?? 0,
    }

    const avatarThumbnailData = {
      profileId: profile.id,
      url: avatarThumbnailUrl,
      fileSize: avatarThumbnailSize ?? 0,
      width: avatarThumbnailMetadata.width ?? 0,
      height: avatarThumbnailMetadata.height ?? 0,
    }

    const newAvatar = new AvatarEntity(avatarData);
    const newAvatarThumbnail = new AvatarEntity(avatarThumbnailData);

    await this.avatarRepository.save(newAvatar);
    await this.avatarRepository.save(newAvatarThumbnail);

    return true
  }
}
