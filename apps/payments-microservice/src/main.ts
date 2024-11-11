import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MicroserviceFilesModule } from '../../files-microservice/src/files.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MicroserviceFilesModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3634,
      },
    },
  );
  await app.listen();
}
bootstrap();
