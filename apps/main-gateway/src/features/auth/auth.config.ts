import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { configValidationUtility } from '../../config/config-validation.utility';

@Injectable()
export class AuthConfig {
	@IsNotEmpty()
	secretAccess: string = this.configService.get('SECRET_KEY_ACCESS_TOKEN');

	@IsNotEmpty()
	secretRefresh: string = this.configService.get('SECRET_KEY_REFRESH_TOKEN');

	@IsNotEmpty()
	accessExpiresIn: string = this.configService.get('ACCESS_TOKEN_LIVE_TIME');

	@IsNotEmpty()
	refreshExpiresIn: string = this.configService.get('REFRESH_TOKEN_LIVE_TIME');

	@IsNotEmpty()
	recaptchaSecretKey: string = this.configService.get('RECAPTCHA_SECRET_KEY');

	@IsNotEmpty()
	recaptchaExternalKey: string = this.configService.get('RECAPTCHA_EXTERNAL_KEY');

	constructor(private configService: ConfigService<any, true>) {
		configValidationUtility.validateConfig(this);
	}
}
