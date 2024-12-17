import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from 'apps/main-gateway/src/config/config-validation.utility';
import { IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class MailConfig {
	@IsNotEmpty({ message: 'MAILER_LOGIN is not defined' })
	mailerLogin: string = this.configService.get('MAILER_LOGIN');

	@IsNotEmpty()
	mailerPassword: string = this.configService.get('MAILER_PASSWORD');

	@IsNotEmpty()
	mailerService: string = this.configService.get('MAILER_SERVICE');

	constructor(private configService: ConfigService<any, true>) {
		configValidationUtility.validateConfig(this);
	}
}
