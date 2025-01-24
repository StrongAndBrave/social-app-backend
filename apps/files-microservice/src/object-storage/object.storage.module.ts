import { Module } from '@nestjs/common';
import { YandexStorageController } from './object.storage.controller';
import { YandexStorageAdapter } from './object.storage.service';
import { CoreConfig } from '../config/configuration';
import { ConfigModule } from '@nestjs/config';
import { configModule } from '../config/config-dynamic-module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), configModule],
	controllers: [YandexStorageController],
	providers: [YandexStorageAdapter, CoreConfig],
})
export class MicroserviceFilesModule {}
