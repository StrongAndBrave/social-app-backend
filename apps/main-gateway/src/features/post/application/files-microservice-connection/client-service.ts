import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class FilesClientService implements OnModuleInit {
	private client: ClientProxy;

	onModuleInit() {
		this.client = ClientProxyFactory.create({
			transport: Transport.TCP,
			options: {
				host: 'localhost',
				port: 3630,
			},
		});
	}

	async uploadFile(data: { postId: string; userId: string; image: Buffer }) {
		return this.client.send('upload_image', data);
	}
}
