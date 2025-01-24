import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/prisma/prisma.service';
import { PostOutputModel } from '../api/models/output/post.output';

@Injectable()
export class PostQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findPosts(userId: string): Promise<PostOutputModel[]> {
		const items = await this.prisma.post.findMany({
			where: { userId: userId, deletedAt: null },
			include: { user: true },
			orderBy: { createdAt: 'desc' },
			take: 8,
		});

		return items.map((item) => ({
			id: item.id,
			owner: {
				ownerId: item.user.id,
				ownerName: item.user.username,
			},
			description: item.description,
			image: item.image,
			createdAt: item.createdAt.toISOString(),
			updatedAt: item.updatedAt.toISOString(),
		}));
	}
}
