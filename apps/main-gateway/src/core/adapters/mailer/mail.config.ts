import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from 'apps/main-gateway/src/config/config-validation.utility';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class EmailConfig {
	@IsNotEmpty({ message: 'MAILER_LOGIN is not defined' })
	mailerLogin: string = this.configService.get('MAILER_LOGIN');

	@IsNotEmpty()
	mailerPassword: string = this.configService.get('MAILER_PASSWORD');

	@IsNotEmpty()
	mailerService: string = this.configService.get('MAILER_SERVICE');

	constructor(
		private configService: ConfigService<any, true>,
		//private readonly logger = new Logger(EmailConfig.name)
	) {
		//this.logger.log('MailConfig initialized');
		configValidationUtility.validateConfig(this);
	}
}
