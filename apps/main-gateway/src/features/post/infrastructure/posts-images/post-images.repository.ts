import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../../libs/prisma/prisma.service';
import { PostImageEntity } from '../../domain/postImageEntity';
import { PostImages } from '@prisma/client';

@Injectable()
export class PostImagesRepository {
	constructor(private readonly prisma: PrismaService) {}

	async saveImages(data: PostImageEntity): Promise<PostImages> {
		return this.prisma.postImages.create({ data });
	}

	async findImagesByPostId(postId: string): Promise<PostImages[]> {
		return this.prisma.postImages.findMany({ where: { postId: postId } });
	}
}
