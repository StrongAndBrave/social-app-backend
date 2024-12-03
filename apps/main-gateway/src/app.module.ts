import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env'],
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