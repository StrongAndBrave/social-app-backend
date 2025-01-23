import { Module } from '@nestjs/common';
import { YandexStorageController } from './object.storage.controller';
import { YandexStorageAdapter } from './object.storage.service';

@Module({
	imports: [],
	controllers: [YandexStorageController],
	providers: [YandexStorageAdapter],
})
export class MicroserviceFilesModule {}
