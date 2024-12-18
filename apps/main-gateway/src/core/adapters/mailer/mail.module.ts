import { Module } from '@nestjs/common';
import { EmailConfig } from './mail.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';



@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<any, true>) => {
        const mailConfig = new EmailConfig(configService);
        console.log(1)
        return {
        transport: {
          service: mailConfig.mailerService,
          secure: false,
          auth: {
            user: mailConfig.mailerLogin,
            pass: mailConfig.mailerPassword,
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
      }},
    })
  ],
  providers: [
   //EmailConfig,
    {
      provide: MailService.name,
      useClass: MailService,
    },
  ],
  exports: [MailService.name],
})
export class MailModule {
}
