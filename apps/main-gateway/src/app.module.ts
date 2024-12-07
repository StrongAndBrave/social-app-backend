import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, {
  ConfigurationType,
  validate,
} from './config/env/configuration';
import { Environments } from './config/env/env-settings';

@Module({
  imports: [
    // Для примера конфига БД
    // MongooseModule.forRootAsync({
    //   useFactory: (configService: ConfigService<ConfigurationType, true>) => {
    //     const databaseSettings = configService.get('databaseSettings', {
    //       infer: true,
    //     });

    //     const uri = databaseSettings.DB_URL;
    //     console.log('DB_URI', uri);

    //     return {
    //       uri: uri,
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validate,
      //игнорируем файлы конфигурации в production и staging
      ignoreEnvFile:
        process.env.ENV !== Environments.DEVELOPMENT &&
        process.env.ENV !== Environments.TEST,
      //указывает откуда брать конфигурации (приоритет справа налево)
      //.env.testing самый приоритетный в тестовой среде
      envFilePath: [
        process.env.ENV === Environments.TEST ? '.env.testing' : '',
        '.env.development.local',
        '.env.development',
        '.env',
      ],
    }),

    ClientsModule.registerAsync([
      {
        name: 'FILES_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('FILES_SERVICE_HOST', 'localhost'),
            port: configService.get<number>('FILES_SERVICE_PORT', 3630),
          },
        }),
        inject: [ConfigService],
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}