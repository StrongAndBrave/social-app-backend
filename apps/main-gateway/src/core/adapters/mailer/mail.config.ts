import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from 'apps/main-gateway/src/config/config-validation.utility';
import { IsNotEmpty } from 'class-validator';
import { log } from 'console';

@Injectable()
export class EmailConfig {
	@IsNotEmpty({ message: 'MAILER_LOGIN is not defined' })
	mailerLogin: string = this.configService.get('MAILER_LOGIN');

	@IsNotEmpty()
	mailerPassword: string = this.configService.get('MAILER_PASSWORD');

	@IsNotEmpty()
	mailerService: string = this.configService.get('MAILER_SERVICE');

	constructor(private configService: ConfigService<any, true>,
		//private readonly logger = new Logger(EmailConfig.name)
	) {
		console.log('EmailConfig initialized')
		//this.logger.log('MailConfig initialized');
		console.log('MAILCONFIG', this.mailerLogin);
		configValidationUtility.validateConfig(this);
		console.log('MAILCONFIG', this.mailerLogin);
	}
}
