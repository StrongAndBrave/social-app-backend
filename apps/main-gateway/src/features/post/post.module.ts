import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PostRepository } from './infrastructure/posts/post.repository';
import { CreatePostUseCase } from './application/use-cases/create.post.use-case';
import { PostController } from './api/post.controller';
import { DeletePostUseCase } from './application/use-cases/delete.post.use-case';
import { PostUpdateUseCase } from './application/use-cases/update.post.use-case';
import { PostQueryRepository } from './infrastructure/posts/post.query.repository';
import { FilesClientService } from '../../core/tcp-connections/files-microservice-connection/files.client.service';
import { PostImagesRepository } from './infrastructure/posts-images/post-images.repository';
import { PostImageSaveUseCase } from './application/use-cases/save.image.use-case';
import { FilesClientModule } from '../../core/tcp-connections/files-microservice-connection/files.client.module';

@Module({
	imports: [JwtModule, FilesClientModule],
	providers: [
		{
			provide: PostImagesRepository.name,
			useClass: PostImagesRepository,
		},
		{
			provide: PostRepository.name,
			useClass: PostRepository,
		},
		{
			provide: PostQueryRepository.name,
			useClass: PostQueryRepository,
		},
		CreatePostUseCase,
		PostUpdateUseCase,
		PostImageSaveUseCase,
		DeletePostUseCase,
		FilesClientService,
	],
	controllers: [PostController],
})
export class PostModule {}
