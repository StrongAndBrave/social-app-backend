import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostRepository } from '../../infrastructure/post.repository';
import { PostEntity } from '../../domain/post.entity';
import { PostCreateModel } from '../../api/models/input/post.input';
import axios from 'axios';

export class PostCreateCommand {
	constructor(
		public userId: string,
		public description: string,
		public image: Express.Multer.File,
	) {}
}

@CommandHandler(PostCreateCommand)
export class CreatePostUseCase implements ICommandHandler<PostCreateCommand> {
	constructor(
		@Inject(PostRepository.name) private readonly postRepository: PostRepository,
	) {}

	async execute(command: PostCreateCommand): Promise<string> {
		const postCreateData: PostCreateModel = {
			userId: command.userId,
			description: command.description,
			image: 'image',
		};

		const newPost = new PostEntity(postCreateData);
		const addedPost = await this.postRepository.createPost(newPost);

		const url = 'http://localhost:3630/object-storage/upload';
		const uploadImage = await axios({
			method: 'post',
			url: url,
			data: {
				postId: addedPost.id,
				userId: addedPost.userId,
				image: command.image,
			},
		});

		return addedPost.id ?? null;
	}
}
