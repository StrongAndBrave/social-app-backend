import { NestFactory } from '@nestjs/core';
import { MicroserviceFilesModule } from './files.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MicroserviceFilesModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3633,
      },
    },
  );
  await app.listen();
}
bootstrap();
