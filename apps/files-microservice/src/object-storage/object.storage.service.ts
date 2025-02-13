import { Injectable } from '@nestjs/common';
import {
	DeleteObjectCommand,
	DeleteObjectCommandOutput,
	PutObjectCommand,
	PutObjectCommandOutput,
	S3Client,
} from '@aws-sdk/client-s3';
import { CoreConfig } from '../config/configuration';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { UploadImageModel, UploadImageTypeEnum } from '../models/input/upload-image.model';
import { OutputImageModel } from '../models/output/output-image.models';
import { AVATAR_HEIGHT, AVATAR_THUMBNAIL_HEIGHT, AVATAR_THUMBNAIL_WIDTH, AVATAR_WIDTH } from '../constants/filesConstants';

@Injectable()
export class YandexStorageAdapter {
	s3Client: S3Client;
	constructor(private readonly coreConfig: CoreConfig) {
		this.s3Client = new S3Client({
			region: this.coreConfig.yandexObjectStorageRegion,
			endpoint: this.coreConfig.yandexObjectStorageUrl,
			credentials: {
				secretAccessKey: this.coreConfig.yandexObjectStorageSecretKey,
				accessKeyId: this.coreConfig.yandexObjectStorageClientId,
			},
		});
	}

	async saveImage(userId: string, image: Buffer) {
		const imageId = uuidv4();
		const key = `images/users/user_${userId}/posts/${imageId}_image.png`;
		const bucketParams = {
			Bucket: this.coreConfig.yandexObjectStorageBucket,
			Key: key,
			Body: image,
			ContentType: this.coreConfig.yandexObjectStorageContentType,
		};

		const command = new PutObjectCommand(bucketParams);

		try {
			const uploadResult: PutObjectCommandOutput = await this.s3Client.send(command);
			console.log(`upload file result: ${uploadResult}`);
			return { url: key };
		} catch (exception) {
			console.error(exception);
			throw exception;
		}
	}

	async saveFile(uploadImageModel: UploadImageModel): Promise<OutputImageModel> {
		const fileId = uuidv4();
		const thumbnailFileId = uuidv4();
		const key = `images/users/user_${uploadImageModel.userId}/${uploadImageModel.imageType}/${fileId}_post.png`;
		const thumbnailKey = `images/users/user_${uploadImageModel.userId}/${uploadImageModel.imageType}/${thumbnailFileId}_post_thumbnail.png`;

		const bucketParams = {
			Bucket: this.coreConfig.yandexObjectStorageBucket,
			Key: key,
			Body: uploadImageModel.fileBuffer,
			ContentType: this.coreConfig.yandexObjectStorageContentType,
		};

		const thumbnailBucketParams = {
			Bucket: this.coreConfig.yandexObjectStorageBucket,
			Key: thumbnailKey,
			Body: uploadImageModel.fileBuffer,
			ContentType: this.coreConfig.yandexObjectStorageContentType,
		};

		if (uploadImageModel.imageType === UploadImageTypeEnum.AVATAR) {
			const avatar = sharp(uploadImageModel.fileBuffer).resize(AVATAR_WIDTH, AVATAR_HEIGHT).toFormat('png');
			const avatarBuffer = await avatar.toBuffer();
			bucketParams.Body = avatarBuffer;

			const avatarThumbnail = sharp(uploadImageModel.fileBuffer).resize(AVATAR_THUMBNAIL_WIDTH, AVATAR_THUMBNAIL_HEIGHT).toFormat('png');
			const avatarThumbnailBuffer = await avatarThumbnail.toBuffer();
			thumbnailBucketParams.Body = avatarThumbnailBuffer;
		}

		let metadata;
		try {
			metadata = await sharp(bucketParams.Body).metadata();
		} catch (error) {
			console.error("Ошибка при извлечении метаданных:", error);
			throw new Error("Невозможно обработать изображение");
		}

		let thumbnailMetadata;
		try {
			thumbnailMetadata = await sharp(thumbnailBucketParams.Body).metadata();
		} catch (error) {
			console.error("Ошибка при извлечении метаданных:", error);
			throw new Error("Невозможно обработать изображение");
		}

		const command = new PutObjectCommand(bucketParams);
		const thumbnailCommand = new PutObjectCommand(thumbnailBucketParams);

		try {
			const uploadPromises = [
				this.s3Client.send(command),
				this.s3Client.send(thumbnailCommand)
		  ];
	 
		  const [uploadResult, thumbnailUploadResult] = await Promise.all(uploadPromises);
	 
		  console.log(`upload file result: ${uploadResult}`);
		  console.log(`upload thumbnail file result: ${thumbnailUploadResult}`);
			return {
				url: key,
				thumbnailUrl: thumbnailKey,
				size: metadata.size,
				thumbnailSize: thumbnailMetadata.size,
				width: metadata.width,
				height: metadata.height,
				thumbnailWidth: thumbnailMetadata.width,
				thumbnailHeight: thumbnailMetadata.height,
			};
		} catch (exception) {
			console.error(exception);
			throw exception;
		}
	}
	// async saveAvatar(userId: string, image: Buffer) {
	// 	const imageId = uuidv4();
	// 	const key = `images/users/user_${userId}/profile/${imageId}_avatar.png`;
	// 	const bucketParams = {
	// 		Bucket: this.coreConfig.yandexObjectStorageBucket,
	// 		Key: key,
	// 		Body: image,
	// 		ContentType: this.coreConfig.yandexObjectStorageContentType,
	// 	};

	// 	const command = new PutObjectCommand(bucketParams);

	// 	try {
	// 		const uploadResult: PutObjectCommandOutput = await this.s3Client.send(command);
	// 		console.log(`upload file result: ${uploadResult}`);
	// 		return { url: key };
	// 	} catch (exception) {
	// 		console.error(exception);
	// 		throw exception;
	// 	}
	// }

	async deleteImage(filePath: string) {
		const bucketParams = {
			Bucket: this.coreConfig.yandexObjectStorageBucket,
			Key: filePath,
		};

		const command = new DeleteObjectCommand(bucketParams);

		try {
			const deleteResult: DeleteObjectCommandOutput = await this.s3Client.send(command);
			console.log(`delete file result: ${deleteResult}`);
			return true;
		} catch (exception) {
			console.error(exception);
			throw exception;
		}
	}
}

// async function getMetadata(buffer: Buffer) {
// 	try {
// 		 const metadata = await sharp(buffer).metadata();
// 		 if (!metadata.width || !metadata.height) {
// 			  throw new Error("Некорректные метаданные изображения");
// 		 }
// 		 return metadata;
// 	} catch (error) {
// 		 console.error("Ошибка при извлечении метаданных:", error);
// 		 throw new Error("Невозможно обработать изображение");
// 	}
// }