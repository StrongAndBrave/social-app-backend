import { Injectable } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from '../../config/config-validation.utility';

@Injectable()
export class PostConfig {
	@IsNotEmpty()
	filesServiceHost: string = this.configService.get('FILES_SERVICE_HOST');

	@IsNotEmpty()
	filesServicePort: number = this.configService.get('FILES_SERVICE_PORT');

	constructor(private configService: ConfigService<any, true>) {
		configValidationUtility.validateConfig(this);
	}
}
