import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PaymentsConfig } from '../../../features/payments/payments.config';

@Injectable()
export class PaymentsClientService implements OnModuleInit {
	@Inject(PaymentsConfig.name) private readonly paymentsConfig: PaymentsConfig;
	private client: ClientProxy;

	onModuleInit() {
		this.client = ClientProxyFactory.create({
			transport: Transport.TCP,
			options: {
				host: this.paymentsConfig.paymentsServiceHost,
				port: this.paymentsConfig.paymentsServicePort,
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
