import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostRepository } from '../../infrastructure/posts/post.repository';
import {
	ForbiddenDomainException,
	NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';

export class PostUpdateCommand {
	constructor(
		public userId: string,
		public postId: string,
		public description: string,
	) {}
}

@CommandHandler(PostUpdateCommand)
export class PostUpdateUseCase implements ICommandHandler<PostUpdateCommand> {
	constructor(
		@Inject(PostRepository.name) private readonly postRepository: PostRepository,
	) {}

	async execute(command: PostUpdateCommand): Promise<boolean> {
		const post = await this.postRepository.getByUnique({ id: command.postId });
		if (!post) throw NotFoundDomainException.create('Post not found');
		if (post.userId !== command.userId)
			throw ForbiddenDomainException.create('Unauthorized');

		await this.postRepository.updatePost({
			where: { id: command.postId },
			data: { description: command.description },
		});
		return true;
	}
}
