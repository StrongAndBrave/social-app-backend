import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { configValidationUtility } from './config-validation.utility';

@Injectable()
export class CoreConfig {
	@IsNumber(
		{},
		{
			message: 'Set Env variable HTTP PORT, example: 3000',
		},
	)
	httpPort: number = Number(this.configService.get('HTTP_PORT'));

	@IsNumber(
		{},
		{
			message: 'Set Env variable TCP PORT, example: 3000',
		},
	)
	tcpPort: number = Number(this.configService.get('TCP_PORT'));

	@IsNotEmpty()
	tcpHost: string = this.configService.get('TCP_HOST');

	constructor(private configService: ConfigService<any, true>) {
		configValidationUtility.validateConfig(this);
	}
}
