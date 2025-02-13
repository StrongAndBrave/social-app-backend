import { Controller } from '@nestjs/common';
import { YandexStorageAdapter } from './object.storage.service';
import { MessagePattern } from '@nestjs/microservices';
import { UploadImageModel } from '../models/input/upload-image.model';
import { OutputImageModel } from '../models/output/output-image.models';

@Controller()
export class YandexStorageController {
	constructor(private readonly yandexStorageAdapter: YandexStorageAdapter) { }

	@MessagePattern('upload_image')
	async uploadImage(data: { userId: string; image: Buffer }) {
		const imageBuffer = Buffer.from(data.image);
		const result = await this.yandexStorageAdapter.saveImage(data.userId, imageBuffer);
		return result.url;
	}

	@MessagePattern('upload_file')
	async uploadFile(data: UploadImageModel): Promise<OutputImageModel> {
		const imageBuffer = Buffer.from(data.fileBuffer);

		const uploadImageModel: UploadImageModel = {
			userId: data.userId,
			fileBuffer: imageBuffer,
			imageType: data.imageType
		};

		return await this.yandexStorageAdapter.saveFile(uploadImageModel);
	}

	@MessagePattern('delete_image')
	async deleteImage(data: { filePath: string }) {
		return await this.yandexStorageAdapter.deleteImage(data.filePath);
	}
}
