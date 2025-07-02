import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { configValidationUtility } from './config-validation.utility';

@Injectable()
export class CoreConfig {
	@IsNumber(
		{},
		{
			message: 'Set Env variable PORT, example: 3000',
		},
	)
	port: number = Number(this.configService.get('PORT'));

	@IsNotEmpty()
	host: string = this.configService.get('HOST');

	@IsNotEmpty()
	yandexObjectStorageSecretKey: string = this.configService.get(
		'YANDEX_OBJECT_STORAGE_SECRET_KEY',
	);

	@IsNotEmpty()
	yandexObjectStorageClientId: string = this.configService.get(
		'YANDEX_OBJECT_STORAGE_CLIENT_ID',
	);

	@IsNotEmpty()
	yandexObjectStorageRegion: string = this.configService.get(
		'YANDEX_OBJECT_STORAGE_REGION',
	);

	@IsNotEmpty()
	yandexObjectStorageUrl: string = this.configService.get('YANDEX_OBJECT_STORAGE_URL');

	@IsNotEmpty()
	yandexObjectStorageBucket: string = this.configService.get(
		'YANDEX_OBJECT_STORAGE_BUCKET',
	);

	@IsNotEmpty()
	yandexObjectStorageContentType: string = this.configService.get(
		'YANDEX_OBJECT_STORAGE_CONTENT_TYPE',
	);

	constructor(private configService: ConfigService<any, true>) {
		configValidationUtility.validateConfig(this);
	}
}
