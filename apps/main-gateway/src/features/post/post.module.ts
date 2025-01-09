import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PostRepository } from './infrastructure/post.repository';
import { CreatePostUseCase } from './application/use-cases/create.post.use-case';
import { PostController } from './api/post.controller';
import { DeletePostUseCase } from './application/use-cases/delete.post.use-case';
import { PostUpdateUseCase } from './application/use-cases/update.post.use-case';

@Module({
	imports: [JwtModule],
	providers: [
		{
			provide: PostRepository.name,
			useClass: PostRepository,
		},
		CreatePostUseCase,
		PostUpdateUseCase,
		DeletePostUseCase,
	],
	controllers: [PostController],
})
export class PostModule {}
