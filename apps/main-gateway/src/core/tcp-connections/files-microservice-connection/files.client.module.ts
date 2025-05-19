import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FilesClientService } from './files.client.service';
import { FilesClientConfig } from './files.client.config';
import { FilesClientConfigModule } from './files.client.config.module';

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: 'FILES_SERVICE',
				inject: [FilesClientConfig],
				imports: [FilesClientConfigModule],
				useFactory: (filesClientConfig: FilesClientConfig) => ({
					transport: Transport.TCP,
					options: {
						host: filesClientConfig.filesServiceHost,
						port: filesClientConfig.filesServicePort,
					},
				}),
			},
		]),
	],
	providers: [FilesClientConfig, FilesClientService],
	exports: [FilesClientService, ClientsModule],
})
export class FilesClientModule {}
