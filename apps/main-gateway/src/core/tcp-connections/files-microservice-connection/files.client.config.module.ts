import { Module } from '@nestjs/common';
import { FilesClientConfig } from './files.client.config';

@Module({
	imports: [],
	providers: [FilesClientConfig],
	exports: [FilesClientConfig],
})
export class FilesClientConfigModule {}
