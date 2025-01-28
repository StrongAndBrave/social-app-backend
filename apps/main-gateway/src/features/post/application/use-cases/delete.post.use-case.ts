import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../../infrastructure/post.repository';
import { Inject } from '@nestjs/common';
import {
	ForbiddenDomainException,
	NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { FilesClientService } from '../files-microservice-connection/client-service';

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
		private readonly filesClientService: FilesClientService,
	) {}

	async execute(command: PostDeleteCommand): Promise<boolean> {
		const post = await this.postRepository.getByUnique({ id: command.postId });
		if (!post) throw NotFoundDomainException.create('Post not found');
		if (post.userId !== command.userId)
			throw ForbiddenDomainException.create('Unauthorized');

		await this.postRepository.softDeleteById(command.postId);
		await this.filesClientService.deleteFile({
			filePath: post.image,
		});
		return true;
	}
}
