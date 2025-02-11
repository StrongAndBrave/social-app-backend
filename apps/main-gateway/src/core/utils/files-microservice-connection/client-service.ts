import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CoreConfig } from '../../../config/env/configuration';

@Injectable()
export class FilesClientService implements OnModuleInit {
	@Inject(CoreConfig.name) private readonly coreConfig: CoreConfig;
	private client: ClientProxy;

	onModuleInit() {
		this.client = ClientProxyFactory.create({
			transport: Transport.TCP,
			options: {
				host: this.coreConfig.filesServiceHost,
				port: this.coreConfig.filesServicePort,
			},
		});
	}

	async uploadFile(data: { userId: string; image: Buffer }) {
		try {
			return await this.client.send('upload_image', data).toPromise();
		} catch (error) {
			console.error('something wrong with upload image: ', error);
			return null;
		}
	}

	async uploadAvatar(data: { userId: string; image: Buffer }) {
		try {
			return await this.client.send('upload_avatar', data).toPromise();
		} catch (error) {
			console.error('something wrong with upload image: ', error);
			return null;
		}
	}

	async deleteFile(data: { filePath: string }) {
		try {
			return await this.client.send('delete_image', data).toPromise();
		} catch (error) {
			console.error('something wrong with upload image: ', error);
			return null;
		}
	}
}
