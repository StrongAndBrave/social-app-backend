import { Module } from '@nestjs/common';
import { MailConfig } from './mail.config';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (mailConfig: MailConfig) => ({
        transport: {
          service: new MailConfig(new ConfigService()).mailerService,
          secure: false,
          auth: {
            user: new MailConfig(new ConfigService()).mailerLogin,
            pass: new MailConfig(new ConfigService()).mailerPassword,
          },
        },
        defaults: {
          from: `Snapfolio <${mailConfig.mailerLogin}>`,
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
  providers: [
    {
      provide: MailConfig.name,
      useClass: MailConfig,
    },
    MailService,
    // {
    //   provide: MailService.name,
    //   useClass: MailService,
    // },
  ],
  exports: [MailService],
})
export class MailModule {
}
