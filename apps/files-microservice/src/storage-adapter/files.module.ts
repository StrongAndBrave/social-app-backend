import { Module } from '@nestjs/common';
import { YandexStorageController } from './files.controller';
import { YandexStorageAdapter } from './files.service';

@Module({
	imports: [],
	controllers: [YandexStorageController],
	providers: [YandexStorageAdapter],
})
export class MicroserviceFilesModule {}
