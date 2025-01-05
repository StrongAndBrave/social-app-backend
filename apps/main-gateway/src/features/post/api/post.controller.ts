import {
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUserId } from '../../../core/decorators/transform/current-user-id.param.decorator';

@Controller('posts')
export class PostController {
	constructor(private commandBus: CommandBus) {}

	@Get(':userId')
	@HttpCode(200)
	async findPosts(@Param('userId') userId: string) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@HttpCode(204)
	async createPost(@CurrentUserId() userId: string) {}

	@Put(':id')
	@UseGuards(JwtAuthGuard)
	async updatePost(@Param('id') id: string) {}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async deletePost(@Param('id') id: string) {}
}
