import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../../infrastructure/posts/post.repository';
import { Inject } from '@nestjs/common';
import {
	ForbiddenDomainException,
	NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { FilesClientService } from '../../../../core/tcp-connections/files-microservice-connection/files-client-service';
import { PostImagesRepository } from '../../infrastructure/posts-images/post-images.repository';

export class PostDeleteCommand {
	constructor(
		public userId: string,
		public postId: string,
	) {}
}

@CommandHandler(PostDeleteCommand)
export class DeletePostUseCase implements ICommandHandler<PostDeleteCommand> {
	constructor(
		@Inject(PostRepository.name) private postRepository: PostRepository,
		@Inject(PostImagesRepository.name)
		private readonly postImagesRepository: PostImagesRepository,
		private readonly filesClientService: FilesClientService,
	) {}

	async execute(command: PostDeleteCommand): Promise<boolean> {
		const post = await this.postRepository.getByUnique({ id: command.postId });
		if (!post) throw NotFoundDomainException.create('Post not found');
		if (post.userId !== command.userId)
			throw ForbiddenDomainException.create('Unauthorized');

		await this.postRepository.softDeleteById(command.postId);
		const images = await this.postImagesRepository.findImagesByPostId(post.id);
		await Promise.all(
			images.flatMap((img) =>
				img.imagesUrl.map((url) => this.filesClientService.deleteFile({ filePath: url })),
			),
		);
		return true;
	}
}
