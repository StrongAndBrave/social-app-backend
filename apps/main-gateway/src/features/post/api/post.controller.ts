import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Inject,
	Param,
	Post,
	Put,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUserId } from '../../../core/decorators/transform/current-user-id.param.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { NewDescriptionModel, PostInputModel } from './models/input/post.input';
import { PostCreateCommand } from '../application/use-cases/create.post.use-case';
import { PostDeleteCommand } from '../application/use-cases/delete.post.use-case';
import { PostUpdateCommand } from '../application/use-cases/update.post.use-case';
import { PostQueryRepository } from '../infrastructure/posts/post.query.repository';
import { PostImageSaveCommand } from '../application/use-cases/save.image.use-case';

@Controller('posts')
export class PostController {
	constructor(
		private commandBus: CommandBus,
		@Inject(PostQueryRepository.name) private postQueryRepository: PostQueryRepository,
	) {}

	@Get(':userId')
	@HttpCode(200)
	async findPosts(@Param('userId') userId: string) {
		return this.postQueryRepository.findPosts(userId);
	}

	@Post()
	@UseInterceptors(
		FilesInterceptor('images', 10, { limits: { fileSize: 5 * 1024 * 1024 } }),
	)
	@UseGuards(JwtAuthGuard)
	@HttpCode(201)
	async createPost(
		@Body() body: PostInputModel,
		@CurrentUserId() userId: string,
		@UploadedFiles() images: Express.Multer.File[],
	) {
		if (!images || images.length < 0) {
			throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
		}
		// Проверяем, что все файлы имеют буфер
		const invalidFiles = images.filter((image) => !Buffer.isBuffer(image.buffer));
		if (invalidFiles.length > 0) {
			throw new HttpException('Invalid image format', HttpStatus.BAD_REQUEST);
		}
		const postData = await this.commandBus.execute(
			new PostCreateCommand(
				userId,
				body.description,
				images.map((img) => img.buffer),
			),
		);
		if (!postData)
			throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);

		const newImages = await this.commandBus.execute(
			new PostImageSaveCommand(postData.postId, postData.imagesUrl),
		);
		if (!newImages)
			throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
		return this.postQueryRepository.findPostById({ id: postData.postId });
	}

	@Put(':postId')
	@UseGuards(JwtAuthGuard)
	@HttpCode(204)
	async updatePost(
		@CurrentUserId() userId: string,
		@Param('postId') postId: string,
		@Body() body: NewDescriptionModel,
	): Promise<void> {
		await this.commandBus.execute(
			new PostUpdateCommand(userId, postId, body.description),
		);
		return;
	}

	@Delete(':postId')
	@UseGuards(JwtAuthGuard)
	@HttpCode(204)
	async deletePost(@Param('postId') postId: string, @CurrentUserId() userId: string) {
		await this.commandBus.execute(new PostDeleteCommand(userId, postId));
		return;
	}
}
