import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/prisma/prisma.service';
import { PostOutputModel } from '../api/models/output/post.output';
import { Prisma } from '@prisma/client';

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
			image: `https://storage.yandexcloud.net/social-app/${item.image}`,
			createdAt: item.createdAt.toISOString(),
		}));
	}

	async findPostById(
		dataWhereUniqueInput: Prisma.PostWhereUniqueInput,
	): Promise<PostOutputModel | null> {
		const post = await this.prisma.post.findUnique({
			where: { ...dataWhereUniqueInput, deletedAt: null },
			include: { user: true },
		});

		return post
			? {
					id: post.id,
					owner: {
						ownerId: post.user.id,
						ownerName: post.user.username,
					},
					description: post.description,
					image: `https://storage.yandexcloud.net/social-app/${post.image}`,
					createdAt: post.createdAt.toISOString(),
				}
			: null;
	}
}
