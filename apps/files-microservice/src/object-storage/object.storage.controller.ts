import { Controller } from '@nestjs/common';
import { YandexStorageAdapter } from './object.storage.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class YandexStorageController {
	constructor(private readonly yandexStorageAdapter: YandexStorageAdapter) {}

	@MessagePattern({ cmd: 'upload_image' })
	async uploadImage(data: { userId: string; image: Buffer }) {
		const imageBuffer = Buffer.from(data.image);
		const result = await this.yandexStorageAdapter.saveImage(data.userId, imageBuffer);
		return result.url;
	}

	@MessagePattern({ cmd: 'upload_avatar' })
	async uploadAvatar(data: { userId: string; image: Buffer }) {
		const imageBuffer = Buffer.from(data.image);
		const result = await this.yandexStorageAdapter.saveAvatar(data.userId, imageBuffer);
		return result.url;
	}

	@MessagePattern({ cmd: 'delete_image' })
	async deleteImage(data: { filePath: string }) {
		return this.yandexStorageAdapter.deleteImage(data.filePath);
	}
}
