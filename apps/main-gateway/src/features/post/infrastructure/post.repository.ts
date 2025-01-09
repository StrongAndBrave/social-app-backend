import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
import { PostEntity } from '../domain/post.entity';

@Injectable()
export class PostRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createPost(data: PostEntity): Promise<Post> {
		return this.prisma.post.create({ data });
	}

	async getByUnique(
		dataWhereUniqueInput: Prisma.PostWhereUniqueInput,
	): Promise<Post | null> {
		return this.prisma.post.findUnique({
			where: { ...dataWhereUniqueInput, deletedAt: null },
		});
	}

	async softDeleteById(id: string): Promise<Post> {
		return this.prisma.post.update({
			where: { id },
			data: { deletedAt: new Date() },
		});
	}
}
