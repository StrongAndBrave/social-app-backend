import { Injectable } from '@nestjs/common';
import { PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { CoreConfig } from '../config/configuration';
import { Readable } from 'stream';

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

	async saveImage(postId: string, userId: string, image: Buffer) {
		/*const bufferToStream = (buffer: Buffer): Readable => {
			const stream = new Readable();
			stream.push(buffer);
			stream.push(null);
			return stream;
		};*/
		const key = `posts/images/users/user_${userId}/${postId}_image.png`;
		const bucketParams = {
			Bucket: this.coreConfig.yandexObjectStorageBucket,
			Key: key,
			Body: image,
			ContentType: this.coreConfig.yandexObjectStorageContentType,
		};

		const command = new PutObjectCommand(bucketParams);

		try {
			const uploadResult: PutObjectCommandOutput = await this.s3Client.send(command);
			console.log(uploadResult);
			return { url: key };
		} catch (exception) {
			console.error(exception);
			throw exception;
		}
	}
}
