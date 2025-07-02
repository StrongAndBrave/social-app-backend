import { Injectable } from '@nestjs/common';
import { Prisma, Profile } from '@prisma/client';
import { PrismaService } from '../../../../../../libs/prisma/prisma.service';

@Injectable()
export class ProfileQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getByUnique(
		dataWhereUniqueInput: Prisma.ProfileWhereUniqueInput,
	): Promise<Profile | null> {
		return this.prisma.profile.findUnique({
			where: { ...dataWhereUniqueInput, deletedAt: null },
		});
	}

	async findProfileWithAvatarsByUserId(userId: string): Promise<any> {
		const profile = await this.prisma.profile.findUnique({
			where: { userId, deletedAt: null },
			include: {
				avatars: {
					where: { deletedAt: null },
					select: {
						url: true,
						width: true,
						height: true,
						fileSize: true,
						createdAt: true,
					},
				},
			},
		});

		if (!profile) {
			throw new Error('Profile not found');
		}

		return {
			id: profile.id,
			userName: `client ${profile.userId}`,
			firstName: profile.firstName,
			lastName: profile.lastName,
			city: profile.city,
			country: profile.country,
			region: profile.region,
			dateOfBirth: profile.dateOfBirth,
			aboutMe: profile.aboutMe,
			avatars: profile.avatars,
			createdAt: profile.createdAt,
		};
	}
}
