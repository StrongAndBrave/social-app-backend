import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { configValidationUtility } from '../config-validation.utility';

export enum Environments {
	DEVELOPMENT = 'development',
	STAGING = 'staging',
	PRODUCTION = 'production',
	TESTING = 'testing',
}

// each module has it's own *.config.ts

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
	postgresGatewayURI: string = String(this.configService.get('POSTGRES_GATEWAY_URI'));

	@IsEnum(Environments, {
		message:
			'Set correct NODE_ENV value, available values: ' +
			configValidationUtility.getEnumValues(Environments).join(', '),
	})
	env: string;

	@IsNotEmpty()
	filesServiceHost: string = String(this.configService.get('FILES_SERVICE_HOST'));

	@IsNumber(
		{},
		{
			message: 'Set Env variable FILES_SERVICE_PORT, example: 3630',
		},
	)
	filesServicePort: number = Number(this.configService.get('FILES_SERVICE_PORT'));

	constructor(private configService: ConfigService) {
		const nodeEnv = this.configService.get('NODE_ENV');
		if (nodeEnv === undefined) {
			throw new Error('NODE_ENV is not defined');
		}
		this.env = nodeEnv;
		configValidationUtility.validateConfig(this);
	}
}
