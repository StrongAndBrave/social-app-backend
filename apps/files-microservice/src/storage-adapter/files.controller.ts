import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { YandexStorageAdapter } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('object-storage')
export class YandexStorageController {
	constructor(private readonly yandexStorageAdapter: YandexStorageAdapter) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('photo'))
	async uploadPhoto() {}
}
