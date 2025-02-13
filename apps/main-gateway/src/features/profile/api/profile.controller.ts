import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUserId } from '../../../core/decorators/transform/current-user-id.param.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommandBus } from '@nestjs/cqrs';
import { ProfileUpdateModel } from './models/input/profile.input.models';
import { ProfileRepository } from '../infrastructure/profile.repository';
import { AvatarQueryRepository } from '../infrastructure/avatar.query.repository';
import { AddAvatarCommand } from '../application/avatar/create-avatar.use-case';
import { ProfileQueryRepository } from '../infrastructure/profile.query.repository';
import { AvatarDeleteCommand } from '../application/avatar/delete-avatar.use-case';


@Controller('users/profile')
export class ProfileController {
  constructor(private readonly commandBus: CommandBus,
    @Inject(ProfileQueryRepository.name) private profileQueryRepository: ProfileQueryRepository,
    @Inject(AvatarQueryRepository.name) private readonly avatarQueryRepository: AvatarQueryRepository,
    @Inject(ProfileRepository.name) private readonly profileRepository: ProfileRepository,
  ) { }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUserId() userId: string) {
    return await this.profileQueryRepository.findProfileWithAvatarsByUserId(userId);
  }

  @Put()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUserId() userId: string,
    @Body() profileData: ProfileUpdateModel,
  ) {
    await this.profileRepository.update({ where: { userId }, data: profileData });
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar', { limits: { fileSize: 10 * 1024 * 1024 } }))
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async uploadAvatar(
    @CurrentUserId() userId: string,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    if (!avatar) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    // Проверяем, что все файлы имеют буфер
    const invalidFile = avatar.buffer;
    if (!Buffer.isBuffer(invalidFile)) {
      throw new HttpException('Invalid image format', HttpStatus.BAD_REQUEST);
    }
    const newAvatars = await this.commandBus.execute(
      new AddAvatarCommand(
        userId,
        avatar.buffer,
      ),
    );
    if (!newAvatars) throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);

    return await this.avatarQueryRepository.findByUserId(userId);
  }

  @Delete('avatar')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async deleteAvatar(@CurrentUserId() userId: string) {
    return await this.commandBus.execute(new AvatarDeleteCommand(userId));
  }
}