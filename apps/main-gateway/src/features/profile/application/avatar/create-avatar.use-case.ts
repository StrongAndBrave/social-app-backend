import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ProfileRepository } from '../../infrastructure/profile.repository';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { FilesClientService } from '../../../../core/utils/files-microservice-connection/client-service';
import { AvatarRepository } from '../../infrastructure/avatar.repository';
import { AvatarEntity } from '../../domain/avatar.entity';

export interface UploadImageModel {
  userId: string;
  fileBuffer: Buffer;
  imageType: UploadImageTypeEnum;
}

export enum UploadImageTypeEnum {
  AVATAR = 'avatar',
  POST = 'post',
}

export interface OutputImageModel {
  url: string;
  thumbnailUrl: string;
  size: number;
  thumbnailSize: number;
  width: number;
  height: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
}

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

    const profile = await this.profileRepository.getByUnique({ userId: command.userId });
    if (!profile) throw NotFoundDomainException.create('Profile not found');

    const AvatarResponse: OutputImageModel = await this.filesClientService.uploadImage({ userId: command.userId, fileBuffer: command.avatarBuffer, imageType: UploadImageTypeEnum.AVATAR });

    if (!AvatarResponse) {
      throw new Error('Avatar failed to upload');
    }

    const avatarData = {
      profileId: profile.id,
      url: AvatarResponse.url,
      fileSize: AvatarResponse.size,
      width: AvatarResponse.width,
      height: AvatarResponse.height,
    }

    const avatarThumbnailData = {
      profileId: profile.id,
      url: AvatarResponse.thumbnailUrl,
      fileSize: AvatarResponse.thumbnailSize,
      width: AvatarResponse.thumbnailWidth,
      height: AvatarResponse.thumbnailHeight,
    }

    const newAvatar = new AvatarEntity(avatarData);
    const newAvatarThumbnail = new AvatarEntity(avatarThumbnailData);

    await Promise.all([
      this.avatarRepository.save(newAvatar),
      this.avatarRepository.save(newAvatarThumbnail)
    ]);

    return true
  }
}