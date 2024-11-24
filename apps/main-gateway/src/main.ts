import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const PORT = 3630;
  // TODO: Ask why process.env.port return undefined
  //const PORT = process.env.port

  await app.listen(PORT || 3000);
}
bootstrap();
