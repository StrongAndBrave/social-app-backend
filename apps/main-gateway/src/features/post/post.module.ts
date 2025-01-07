import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PostRepository } from './infrastructure/post.repository';
import { PostCreateUseCase } from './application/use-cases/post.create.use-case';
import { PostController } from './api/post.controller';

@Module({
	imports: [JwtModule],
	providers: [
		{
			provide: PostRepository.name,
			useClass: PostRepository,
		},
		PostCreateUseCase,
	],
	controllers: [PostController],
})
export class PostModule {}
