import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([{
      name: 'FILES_SERVICE',
      transport: Transport.TCP,
      options: {
        host: process.env.FILES_SERVICE_HOST || 'files-micro-service',
        port: Number(process.env.FILES_SERVICE_PORT || '3633'),
      },
    },
  {
      name: 'PAYMENTS_SERVICE',
      transport: Transport.TCP,
      options: {
        host: process.env.PAYMENTS_SERVICE_HOST || 'payments-micro-service',
        port: Number(process.env.PAYMENTS_SERVICE_PORT || '3634'),
      },
    },
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
