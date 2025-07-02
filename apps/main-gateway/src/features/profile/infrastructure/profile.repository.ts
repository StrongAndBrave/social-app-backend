import { Injectable } from '@nestjs/common';
import { Prisma, Profile } from '@prisma/client';
import { PrismaService } from '../../../../../../libs/prisma/prisma.service';
import { ProfileEntity } from '../domain/profile.entity';


@Injectable()
export class ProfileRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: ProfileEntity): Promise<Profile> {
		return this.prisma.profile.create({ data });
	}

	async update(params: {
		where: Prisma.ProfileWhereUniqueInput;
		data: Prisma.ProfileUpdateInput;
	}): Promise<Profile> {
		const { where, data } = params;
		return this.prisma.profile.update({
			data,
			where: {
				...where,
				deletedAt: null,
			},
		});
	}

	async getByUnique(
		dataWhereUniqueInput: Prisma.ProfileWhereUniqueInput,
	): Promise<Profile | null> {
		return this.prisma.profile.findUnique({
			where: { ...dataWhereUniqueInput, deletedAt: null },
		});
	}

	async softDeleteById(id: string): Promise<Profile> {
		return this.prisma.profile.update({
			where: { id },
			data: { deletedAt: new Date() },
		});
	}
}
