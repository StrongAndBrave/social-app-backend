import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from 'apps/main-gateway/src/config/config-validation.utility';
import { IsString } from 'class-validator';

@Injectable()
export class MailConfig {
	@IsString()
	MAILER_LOGIN: string;

	@IsString()
	MAILER_PASSWORD: string;

	@IsString()
	MAILER_SERVICE: string;

	constructor(private configService: ConfigService) {
		const mailerLogin = this.configService.get('MAILER_LOGIN');
		if (mailerLogin === undefined) {
			throw new Error('MAILER_LOGIN is not defined');
		}
		this.MAILER_LOGIN = mailerLogin;

		const mailerPassword = this.configService.get('MAILER_PASSWORD');
		if (mailerPassword === undefined) {
			throw new Error('MAILER_PASSWORD is not defined');
		}
		this.MAILER_PASSWORD = mailerPassword;

		const mailerService = this.configService.get('MAILER_SERVICE');
		if (mailerService === undefined) {
			throw new Error('MAILER_SERVICE is not defined');
		}
		this.MAILER_SERVICE = mailerService;

		configValidationUtility.validateConfig(this);
	}
}