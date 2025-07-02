import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../../libs/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PostOutputModel } from '../../api/models/output/post.output';

@Injectable()
export class PostQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findPosts(userId: string): Promise<PostOutputModel[]> {
		const items = await this.prisma.post.findMany({
			where: { userId: userId, deletedAt: null },
			include: { user: true, images: true },
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
			images: item.images.flatMap((img) =>
				img.imagesUrl.map((url) => ({
					image: `https://storage.yandexcloud.net/social-app/${url}`,
				})),
			),
			createdAt: item.createdAt.toISOString(),
		}));
	}

	async findPostById(
		dataWhereUniqueInput: Prisma.PostWhereUniqueInput,
	): Promise<PostOutputModel | null> {
		const post = await this.prisma.post.findUnique({
			where: { ...dataWhereUniqueInput, deletedAt: null },
			include: { user: true, images: true },
		});

		const images = post
			? post.images
					.map((img) =>
						img.imagesUrl.map((url) => ({
							image: `https://storage.yandexcloud.net/social-app/${url}`,
						})),
					)
					.flat()
			: [];

		return post
			? {
					id: post.id,
					owner: {
						ownerId: post.user.id,
						ownerName: post.user.username,
					},
					description: post.description,
					images: images,
					createdAt: post.createdAt.toISOString(),
				}
			: null;
	}
}
