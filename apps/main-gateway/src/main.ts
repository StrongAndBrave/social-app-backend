import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  // TODO: Ask why process.env.port return undefined
  const PORT = process.env.PORT
  console.log('PORT');
  console.log('App is listening on port', PORT);
  await app.listen(PORT || 3630);
}
bootstrap();
