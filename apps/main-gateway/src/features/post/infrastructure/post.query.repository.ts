import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/prisma/prisma.service';
import { PostOutputModel } from '../api/models/output/post.output';

@Injectable()
export class PostQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findPosts(userId: string): Promise<PostOutputModel[]> {
		const posts = await this.prisma.post.findMany({
			select: { id: true, description: true, createdAt: true },
			where: { userId: userId, deletedAt: null },
			orderBy: { createdAt: 'desc' },
			take: 8,
		});

		return posts.map((post) => ({
			id: post.id,
			description: post.description,
			createdAt: post.createdAt.toISOString(),
		}));
	}
}
