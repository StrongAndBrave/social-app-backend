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
