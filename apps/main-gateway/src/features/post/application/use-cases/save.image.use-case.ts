import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostImagesRepository } from '../../infrastructure/posts-images/post-images.repository';
import { PostImageCreateModel } from '../../api/models/input/post.input';
import { PostImageEntity } from '../../domain/postImageEntity';

export class PostImageSaveCommand {
	constructor(
		public postId: string,
		public imagesUrl: string[],
	) {}
}

@CommandHandler(PostImageSaveCommand)
export class PostImageSaveUseCase implements ICommandHandler<PostImageSaveCommand> {
	constructor(
		@Inject(PostImagesRepository.name)
		private readonly postImagesRepository: PostImagesRepository,
	) {}

	async execute(command: PostImageSaveCommand) {
		const postImageCreateData: PostImageCreateModel = {
			postId: command.postId,
			images: command.imagesUrl,
		};

		const newImages = new PostImageEntity(postImageCreateData);

		const addedImages = await this.postImagesRepository.saveImages(newImages);

		return addedImages ?? null;
	}
}
