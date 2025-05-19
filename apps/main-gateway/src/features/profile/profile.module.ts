import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProfileRepository } from './infrastructure/profile.repository';
import { ProfileQueryRepository } from './infrastructure/profile.query.repository';
import { AvatarRepository } from './infrastructure/avatar.repository';
import { AvatarQueryRepository } from './infrastructure/avatar.query.repository';
import { CreateProfileUseCase } from './application/profile/create-profile.use-case';
import { AvatarDeleteUseCase } from './application/avatar/delete-avatar.use-case';
import { AddAvatarUseCase } from './application/avatar/create-avatar.use-case';
import { ProfileController } from './api/profile.controller';
import { FilesClientModule } from '../../core/tcp-connections/files-microservice-connection/files.client.module';
import { FilesClientService } from '../../core/tcp-connections/files-microservice-connection/files.client.service';

@Module({
	imports: [JwtModule, FilesClientModule],
	providers: [
		{
			provide: ProfileRepository.name,
			useClass: ProfileRepository,
		},
		{
			provide: ProfileQueryRepository.name,
			useClass: ProfileQueryRepository,
		},
		{
			provide: AvatarRepository.name,
			useClass: AvatarRepository,
		},
		{
			provide: AvatarQueryRepository.name,
			useClass: AvatarQueryRepository,
		},
		CreateProfileUseCase,
		AvatarDeleteUseCase,
		AddAvatarUseCase,
		FilesClientService,
	],
	controllers: [ProfileController],
})
export class ProfileModule {}
