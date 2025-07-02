import { configModule } from './config/config-dynamic-module'; // must be first
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { MailModule } from './core/adapters/mailer/mail.module';
import { UserModule } from './features/user/user.module';
import { AuthModule } from './features/auth/auth.module';
import { SessionModule } from './features/session/session.module';
import { PostModule } from './features/post/post.module';
import { ProfileModule } from './features/profile/profile.module';
import { HomePageModule } from './features/home-page/home-page.module';
import { PaymentsModule } from './features/payments/payments.module';
import { FilesClientModule } from './core/tcp-connections/files-microservice-connection/files.client.module';
import { PaymentsTCPClientModule } from './core/tcp-connections/payments-microservice-connection/tcp/payment.client.module';

@Module({
	imports: [
		CoreModule,
		configModule,
		MailModule,
		// Для примера конфига БД
		// MongooseModule.forRootAsync({
		//   // если CoreModule не глобальный, то явно импортируем в монгусовский модуль, иначе CoreConfig не заинджектится
		//   imports: [CoreModule],
		//   useFactory: (coreConfig: CoreConfig) => {
		//     // используем DI чтобы достать mongoURI контролируемо
		//     return {
		//       uri: coreConfig.mongoURI,
		//     };
		//   },
		//   inject: [CoreConfig],
		// }),
		UserModule,
		AuthModule,
		SessionModule,
		PostModule,
		ProfileModule,
		HomePageModule,
		PaymentsModule,
		FilesClientModule,
		PaymentsTCPClientModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
// export class AppModule {
//   static async forRoot(coreConfig: CoreConfig): Promise<DynamicModule> {
//     // такой мудрёный способ мы используем, чтобы добавить к основным модулям необязательный модуль.
//     // чтобы не обращаться в декораторе к переменной окружения через process.env в декораторе, потому что
//     // запуск декораторов происходит на этапе склейки всех модулей до старта жизненного цикла самого NestJS
//     const testingModule = [];
//     if (coreConfig.includeTestingModule) {
//       testingModule.push(TestingModule);
//     }

//     return {
//       module: AppModule,
//       imports: testingModule, // Add dynamic modules here
//     };
//   }
// }
