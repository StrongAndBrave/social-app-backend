import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/prisma/prisma.service';
import { Avatar } from '@prisma/client';

@Injectable()
export class AvatarQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findByUserId(userId: string): Promise<Avatar[]> {
		return this.prisma.avatar.findMany({
      where: {
        profile: {
          userId: userId,
          deletedAt: null
        },
        deletedAt: null
      },
    });
	}
}