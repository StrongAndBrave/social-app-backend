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
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUserId } from '../../../core/decorators/transform/current-user-id.param.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { NewDescriptionModel, PostInputModel } from './models/input/post.input';
import { PostCreateCommand } from '../application/use-cases/create.post.use-case';
import { PostDeleteCommand } from '../application/use-cases/delete.post.use-case';
import { PostUpdateCommand } from '../application/use-cases/update.post.use-case';
import { PostQueryRepository } from '../infrastructure/post.query.repository';

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
	@UseInterceptors(FileInterceptor('image', { limits: { fileSize: 5 * 1024 * 1024 } }))
	@UseGuards(JwtAuthGuard)
	@HttpCode(201)
	async createPost(
		@Body() body: PostInputModel,
		@CurrentUserId() userId: string,
		@UploadedFile() image: Express.Multer.File,
	) {
		if (!image || !Buffer.isBuffer(image.buffer)) {
			throw new HttpException('Invalid image format', HttpStatus.BAD_REQUEST);
		}
		const newPost = await this.commandBus.execute(
			new PostCreateCommand(userId, body.description, image.buffer),
		);
		if (!newPost)
			throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
		return this.postQueryRepository.findPostById({ id: newPost });
	}

	@Put(':id')
	@UseGuards(JwtAuthGuard)
	@HttpCode(204)
	async updatePost(
		@CurrentUserId() userId: string,
		@Param('id') id: string,
		@Body() body: NewDescriptionModel,
	): Promise<void> {
		await this.commandBus.execute(new PostUpdateCommand(userId, id, body.description));
		return;
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	@HttpCode(204)
	async deletePost(@Param('id') id: string, @CurrentUserId() userId: string) {
		await this.commandBus.execute(new PostDeleteCommand(userId, id));
		return;
	}
}
