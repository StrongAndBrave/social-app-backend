import { configApp } from './config/apply-app-settings/set-app';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { ConfigService } from '@nestjs/config';
import { CoreConfig } from './config/env/configuration';

async function bootstrap() {
  // // из-за того, что нам нужно донастроить динамический AppModule, мы не можем сразу создавать приложение
  // // а создаём сначала контекст
  // const appContext = await NestFactory.createApplicationContext(AppModule);
  // const coreConfig = appContext.get<CoreConfig>(CoreConfig);
  // // как бы вручную инжектим в инициализацию модуля нужную зависимость, донастраивая динамический модуль
  // const DynamicAppModule = await AppModule.forRoot(coreConfig);
  // // и уже потом создаём на основе донастроенного модуля наше приложение


  const app = await NestFactory.create(AppModule);
  const coreConfig = app.get<CoreConfig>(CoreConfig);
  configApp(app); 

  await app.listen(coreConfig.port, () => {
    console.log('App starting listen port: ', coreConfig.port);
    console.log('ENV: ', coreConfig.env);
  });
}
bootstrap();