import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailConfig } from './mail.config';



@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (mailConfig: MailConfig) => ({
        transport: {
          service: mailConfig.MAILER_SERVICE,
          secure: false,
          auth: {
            user: mailConfig.MAILER_LOGIN,
            pass: mailConfig.MAILER_PASSWORD,
          },
        },
        defaults: {
          from: `Snapfolio <${mailConfig.MAILER_LOGIN}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    })
  ],
  providers: [MailConfig, MailService],
  exports: [MailService],
})
export class MailModule {
}