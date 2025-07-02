import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/prisma/prisma.service';
import { HomePageOutputModel } from '../api/models/output/home-page.output.models';

@Injectable()
export class HomePageQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async usersCountAndPosts(): Promise<HomePageOutputModel> {
		const usersCount = await this.prisma.user.count();
		const posts = await this.prisma.post.findMany({
			where: { deletedAt: null },
			include: { user: true, images: true },
			orderBy: { createdAt: 'desc' },
			take: 4,
		});

		return {
			registeredUsersCount: usersCount,
			posts: posts.map((item) => ({
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
			})),
		};
	}
}
