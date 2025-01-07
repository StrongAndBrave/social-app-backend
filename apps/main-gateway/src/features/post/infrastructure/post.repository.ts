import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/libs/prisma/prisma.service';
import { Post } from '@prisma/client';
import { PostEntity } from '../domain/post.entity';

@Injectable()
export class PostRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createPost(data: PostEntity): Promise<Post> {
		return this.prisma.post.create({ data });
	}
}
