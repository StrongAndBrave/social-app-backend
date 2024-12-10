import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
//import { ConfigService } from '@nestjs/config';
//import { ConfigurationType } from 'apps/main-gateway/src/config/env/configuration';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService,
  //  private configService: ConfigService<ConfigurationType, true>
  ) { }

  async sendUserConfirmation(userEmail: string, userName: string, token: string): Promise<void> {
    const url = `https://snapfolio.ru/confirm-email?code=${token}`;

    await this.mailerService.sendMail({
      to: userEmail,
      subject: 'Welcome! Confirm your Email',
      template: './confirmation',
      context: {
        name: userName,
        url,
        token,
      },
    });
  }
  
  async sendPasswordRecovery(userEmail: string, userName: string, token: string): Promise<void> {
    const url = `https://snapfolio.ru/reset-password?code=${token}`;
    //const a = this.configService.get('apiSettings', { infer: true });
    //a.PORT
    await this.mailerService.sendMail({
      to: userEmail,
      subject: 'Password reset',
      template: 'password.reset',
      context: {
        name: userName,
        url,
        token,
      },
    });
  }
}