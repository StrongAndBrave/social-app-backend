import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostRepository } from '../../infrastructure/post.repository';
import { PostEntity } from '../../domain/post.entity';
import { PostCreateModel } from '../../api/models/input/post.input';
import { FilesClientService } from '../files-microservice-connection/client-service';

export class PostCreateCommand {
	constructor(
		public userId: string,
		public description: string,
		public image: Buffer,
	) {}
}

@CommandHandler(PostCreateCommand)
export class CreatePostUseCase implements ICommandHandler<PostCreateCommand> {
	constructor(
		@Inject(PostRepository.name) private readonly postRepository: PostRepository,
		private readonly filesClientService: FilesClientService,
	) {}

	async execute(command: PostCreateCommand): Promise<string | null> {
		const postCreateData: PostCreateModel = {
			userId: command.userId,
			description: command.description,
			image: 'image',
		};

		const newPost = new PostEntity(postCreateData);
		const addedPost = await this.postRepository.createPost(newPost);

		const uploadImage = await this.filesClientService.uploadFile({
			postId: addedPost.id,
			userId: command.userId,
			image: command.image.toString('base64'),
		});
		console.log('uploadImage: ', uploadImage);
		if (!uploadImage) {
			return null;
		}

		return addedPost.id ?? null;
	}
}
