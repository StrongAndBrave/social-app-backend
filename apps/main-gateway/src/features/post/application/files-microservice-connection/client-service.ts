import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PostConfig } from '../../post.config';

@Injectable()
export class FilesClientService implements OnModuleInit {
	@Inject(PostConfig.name) private readonly postConfig: PostConfig;
	private client: ClientProxy;

	onModuleInit() {
		this.client = ClientProxyFactory.create({
			transport: Transport.TCP,
			options: {
				host: this.postConfig.filesMicroserviceHost,
				port: this.postConfig.filesMicroservicePort,
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

	async deleteFile(data: { filePath: string }) {
		try {
			return await this.client.send('delete_image', data).toPromise();
		} catch (error) {
			console.error('something wrong with upload image: ', error);
			return null;
		}
	}
}
