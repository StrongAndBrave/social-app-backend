import { Controller } from '@nestjs/common';
import { YandexStorageAdapter } from './object.storage.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class YandexStorageController {
	constructor(private readonly yandexStorageAdapter: YandexStorageAdapter) {}

	@MessagePattern('upload_image')
	async uploadImage(data: { postId: string; userId: string; image: string }) {
		const imageBuffer = Buffer.from(data.image);
		console.log('second: ', imageBuffer);
		const result = await this.yandexStorageAdapter.saveImage(
			data.postId,
			data.userId,
			imageBuffer,
		);
		return result.url;
	}
}
