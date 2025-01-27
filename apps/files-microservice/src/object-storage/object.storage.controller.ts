import { Controller } from '@nestjs/common';
import { YandexStorageAdapter } from './object.storage.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class YandexStorageController {
	constructor(private readonly yandexStorageAdapter: YandexStorageAdapter) {}

	@MessagePattern('upload_image')
	async uploadImage(data: { postId: string; userId: string; image: Buffer }) {
		const imageBuffer = Buffer.from(data.image);
		const result = await this.yandexStorageAdapter.saveImage(
			data.postId,
			data.userId,
			imageBuffer,
		);
		return result.url;
	}

	@MessagePattern('delete_image')
	async deleteImage(data: { postId: string; userId: string }) {
		const result = await this.yandexStorageAdapter.deleteImage(data.postId, data.userId);
		console.log(result);
		return !!result;
	}
}
