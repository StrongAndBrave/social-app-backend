import { Module } from '@nestjs/common';
import { EmailConfig } from './mail.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { EmailConfigModule } from './email.config.module';

@Module({
	imports: [
		MailerModule.forRootAsync({
			inject: [EmailConfig],
			imports: [EmailConfigModule],
			useFactory: (emailConfig: EmailConfig) => {
				return {
					transport: {
						service: emailConfig.mailerService,
						secure: false,
						auth: {
							user: emailConfig.mailerLogin,
							pass: emailConfig.mailerPassword,
						},
					},

					defaults: {
						from: `Snapfolio <${emailConfig.mailerLogin}>`,
					},
					template: {
						dir: join(
							process.cwd(),
							'apps/main-gateway/src/core/adapters/mailer/templates',
						),
						adapter: new HandlebarsAdapter(),
						options: {
							strict: true,
						},
					},
				};
			},
		}),
	],
	providers: [
		{
			provide: EmailConfig.name,
			useClass: EmailConfig,
		},
		{
			provide: MailService.name,
			useClass: MailService,
		},
	],
	exports: [MailService.name],
})
export class MailModule {}
