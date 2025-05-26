import { Injectable } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from '../../config/config-validation.utility';

@Injectable()
export class RmqConfig {
	@IsNotEmpty()
	rmqUrl: string = this.configService.get('RMQ_URL');

	@IsNotEmpty()
	rmqQueue: string = this.configService.get('RMQ_QUEUE');

	constructor(private configService: ConfigService<any, true>) {
		configValidationUtility.validateConfig(this);
	}
}
