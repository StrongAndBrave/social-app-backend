import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from 'apps/main-gateway/src/config/config-validation.utility';
import { IsNotEmpty } from 'class-validator';

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

	@IsNotEmpty()
	googleOAuthSecretKey: string = this.configService.get('GOOGLE_OAUTH_SECRET_KEY');

	@IsNotEmpty()
	googleOAuthClientId: string = this.configService.get('GOOGLE_OAUTH_CLIENT_ID');

	@IsNotEmpty()
	googleOAuthCallbackUrl: string = this.configService.get('GOOGLE_OAUTH_CALLBACK_URL');

	constructor(private configService: ConfigService<any, true>) {
		configValidationUtility.validateConfig(this);
	}
}
