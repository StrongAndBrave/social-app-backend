import { Controller } from '@nestjs/common';
import { YandexStorageAdapter } from './object.storage.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('object-storage')
export class YandexStorageController {
	constructor(private readonly yandexStorageAdapter: YandexStorageAdapter) {}

	@MessagePattern({ cmd: 'upload_image' })
	async uploadImage(postId: string, userId: string, image: Buffer) {
		console.log(image);
		const result = await this.yandexStorageAdapter.saveImage(postId, userId, image);
		return result;
	}
}
