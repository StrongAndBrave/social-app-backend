import { Injectable } from '@nestjs/common';
import { PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class YandexStorageAdapter {
	s3Client: S3Client;
	constructor() {
		const REGION = 'us-east-1';
		this.s3Client = new S3Client({
			region: REGION,
			endpoint: 'https://storage.yandexcloud.net',
			credentials: {
				secretAccessKey: '', // todo don`t commit with credentials
				accessKeyId: '',
			},
		});
	}

	async saveImage(postId: string, userId: string, buffer: Buffer) {
		const key = `posts/images/users/user_${userId}/${postId}.png`;
		const bucketParams = {
			Bucket: 'social-app',
			Key: key,
			Body: buffer,
			ContentType: 'image/png',
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
