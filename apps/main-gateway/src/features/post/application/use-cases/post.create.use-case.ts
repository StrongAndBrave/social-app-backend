import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostRepository } from '../../infrastructure/post.repository';
import { PostEntity } from '../../domain/post.entity';
import { PostCreateModel } from '../../api/models/input/post.input';

export class PostCreateCommand {
	constructor(
		public userId: string,
		public description: string,
		public image: Express.Multer.File,
	) {}
}

@CommandHandler(PostCreateCommand)
export class PostCreateUseCase implements ICommandHandler<PostCreateCommand> {
	constructor(
		@Inject(PostRepository.name) private readonly postRepository: PostRepository,
	) {}

	async execute(command: PostCreateCommand): Promise<string> {
		const uploadPhotoURL = 'photoURL';

		const postCreateData: PostCreateModel = {
			userId: command.userId,
			description: command.description,
			image: uploadPhotoURL,
		};

		const newPost = new PostEntity(postCreateData);
		const addedPost = await this.postRepository.createPost(newPost);
		return addedPost.id ?? null;
	}
}
