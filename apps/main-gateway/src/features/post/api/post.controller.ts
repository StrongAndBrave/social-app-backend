import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
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
import { PostInputModel } from './models/input/post.input';
import { PostCreateCommand } from '../application/use-cases/post.create.use-case';
import { use } from 'passport';

@Controller('posts')
export class PostController {
	constructor(private commandBus: CommandBus) {}

	@Get(':userId')
	@HttpCode(200)
	async findPosts(@Param('userId') userId: string) {}

	@Post()
	@UseInterceptors(FileInterceptor('photo'))
	@UseGuards(JwtAuthGuard)
	@HttpCode(204)
	async createPost(
		@Body() body: PostInputModel,
		@CurrentUserId() userId: string,
		@UploadedFile() photo: Express.Multer.File,
	) {
		const newPost = await this.commandBus.execute(
			new PostCreateCommand(userId, body.description, photo),
		);
		if (!newPost)
			throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
		return newPost;
	}

	@Put(':id')
	@UseGuards(JwtAuthGuard)
	async updatePost(@Param('id') id: string) {}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async deletePost(@Param('id') id: string) {}
}
