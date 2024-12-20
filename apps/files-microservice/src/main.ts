import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from 'apps/main-gateway/src/app.module';
import { MicroserviceFilesModule } from './files.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MicroserviceFilesModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3630,
    },
  });

  await app.listen();
  console.log('Files Microservice is listening on port 3630');
}

bootstrap();
