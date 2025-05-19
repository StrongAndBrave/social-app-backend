import { Injectable } from '@nestjs/common';
import { configValidationUtility } from '../../../config/config-validation.utility';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Injectable()
export class FilesClientConfig {
	@IsNotEmpty()
	filesServiceHost: string = String(this.configService.get('FILES_SERVICE_HOST'));

	@IsNumber(
		{},
		{
			message: 'Set Env variable FILES_SERVICE_PORT, example: 3630',
		},
	)
	filesServicePort: number = Number(this.configService.get('FILES_SERVICE_PORT'));

	constructor(private configService: ConfigService<any, true>) {
		configValidationUtility.validateConfig(this);
	}
}
