import { Injectable } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from '../../config/config-validation.utility';

@Injectable()
export class PostConfig {
	@IsNotEmpty()
	filesMicroserviceHost: string = this.configService.get('FILES_MICROSERVICE_HOST');

	@IsNotEmpty()
	filesMicroservicePort: number = this.configService.get('FILES_MICROSERVICE_PORT');

	constructor(private configService: ConfigService<any, true>) {
		configValidationUtility.validateConfig(this);
	}
}
