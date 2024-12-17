import { configModule } from './config/config-dynamic-module'; // must be first
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './core/adapters/mailer/mail.module';
import { CoreModule } from './core/core.module';
import { CoreConfig } from './config/env/configuration';
import { UserModule } from './features/user/user.module';
import { AuthModule } from './features/auth/auth.module';
//import { Session } from 'inspector/promises';
import { SessionModule } from './features/session/session.module';

@Module({
	imports: [
		CoreModule,
		configModule,

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

		MailModule,
		ClientsModule.registerAsync([
			{
				name: 'FILES_SERVICE',
				imports: [CoreModule],
				useFactory: (coreConfig: CoreConfig) => ({
					transport: Transport.TCP,
					options: {
						host: coreConfig.filesServiceHost,
						port: coreConfig.filesServicePort,
					},
				}),
				// inject: [CoreConfig],
			},
			// {
			//   name: 'PAYMENTS_SERVICE',
			//   imports: [ConfigModule],
			//   useFactory: (configService: ConfigService) => ({
			//     transport: Transport.RMQ,
			//     options: {
			//       urls: [configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
			//       queue: configService.get<string>('PAYMENTS_QUEUE', 'payments_queue'),
			//       queueOptions: {
			//         durable: false,
			//       },
			//     },
			//   }),
			//   inject: [ConfigService],
			// },
		]),

		UserModule,
		AuthModule,
		SessionModule,
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
