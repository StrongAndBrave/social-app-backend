import { NestFactory } from '@nestjs/core';
import { AppModule } from "../../../src/app.module";
import { MicroserviceOptions, Transport } from '@nestjs/microservices';



async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3001,
    },
  });

  await app.listen();
  console.log('Files Microservice is listening on port 3001');
}

bootstrap();
