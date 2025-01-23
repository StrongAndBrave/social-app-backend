import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { YandexStorageAdapter } from './object.storage.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('object-storage')
export class YandexStorageController {
	constructor(private readonly yandexStorageAdapter: YandexStorageAdapter) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('image'))
	async uploadPhoto(
		@Body() postId: string,
		@Body() userId: string,
		@UploadedFile() image: Express.Multer.File,
	) {
		const result = await this.yandexStorageAdapter.savePhoto(postId, userId, image);
		return result;
	}
}
