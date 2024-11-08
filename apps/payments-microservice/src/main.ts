import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.port || 3000);
}
bootstrap();
