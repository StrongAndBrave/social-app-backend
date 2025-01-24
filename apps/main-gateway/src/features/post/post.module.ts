import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PostRepository } from './infrastructure/post.repository';
import { CreatePostUseCase } from './application/use-cases/create.post.use-case';
import { PostController } from './api/post.controller';
import { DeletePostUseCase } from './application/use-cases/delete.post.use-case';
import { PostUpdateUseCase } from './application/use-cases/update.post.use-case';
import { PostQueryRepository } from './infrastructure/post.query.repository';
import { FilesClientService } from './application/files-microservice-connection/client-service';
import { PostConfig } from './post.config';

@Module({
	imports: [JwtModule],
	providers: [
		{
			provide: PostRepository.name,
			useClass: PostRepository,
		},
		{
			provide: PostQueryRepository.name,
			useClass: PostQueryRepository,
		},
		{
			provide: PostConfig.name,
			useClass: PostConfig,
		},
		CreatePostUseCase,
		PostUpdateUseCase,
		DeletePostUseCase,
		FilesClientService,
	],
	controllers: [PostController],
})
export class PostModule {}
