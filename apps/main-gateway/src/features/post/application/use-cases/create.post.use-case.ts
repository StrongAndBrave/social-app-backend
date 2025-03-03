import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostRepository } from '../../infrastructure/posts/post.repository';
import { PostEntity } from '../../domain/post.entity';
import { PostCreateModel } from '../../api/models/input/post.input';
import { FilesClientService } from '../../../../core/tcp-connections/files-microservice-connection/files-client-service';

export class PostCreateCommand {
	constructor(
		public userId: string,
		public description: string,
		public images: Buffer[],
	) {}
}

@CommandHandler(PostCreateCommand)
export class CreatePostUseCase implements ICommandHandler<PostCreateCommand> {
	constructor(
		@Inject(PostRepository.name) private readonly postRepository: PostRepository,
		private readonly filesClientService: FilesClientService,
	) {}

	async execute(command: PostCreateCommand) {
		const uploadImagesUrl = await Promise.all(
			command.images.map((img) =>
				this.filesClientService.uploadFile({ userId: command.userId, image: img }),
			),
		);

		if (uploadImagesUrl.some((url) => !url)) {
			throw new Error('One or more images failed to upload');
		}

		const postCreateData: PostCreateModel = {
			userId: command.userId,
			description: command.description,
		};

		const newPost = new PostEntity(postCreateData);
		const addedPost = await this.postRepository.createPost(newPost);

		return { postId: addedPost.id, imagesUrl: uploadImagesUrl };
	}
}
