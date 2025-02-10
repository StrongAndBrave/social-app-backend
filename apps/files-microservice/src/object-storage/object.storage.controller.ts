import { Controller } from '@nestjs/common';
import { YandexStorageAdapter } from './object.storage.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class YandexStorageController {
	constructor(private readonly yandexStorageAdapter: YandexStorageAdapter) {}

	@MessagePattern('upload_image')
	async uploadImage(data: { userId: string; image: Buffer }) {
		const imageBuffer = Buffer.from(data.image);
		const result = await this.yandexStorageAdapter.saveImage(data.userId, imageBuffer);
		return result.url;
	}

	@MessagePattern('upload_avatar')
	async uploadAvatar(data: { userId: string; image: Buffer }) {
		const imageBuffer = Buffer.from(data.image);
		const result = await this.yandexStorageAdapter.saveImage(data.userId, imageBuffer);
		return result.url;
	}

	@MessagePattern('delete_image')
	async deleteImage(data: { filePath: string }) {
		return this.yandexStorageAdapter.deleteImage(data.filePath);
	}
}
