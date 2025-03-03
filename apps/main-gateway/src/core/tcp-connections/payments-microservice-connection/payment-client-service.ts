import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PaymentConfig } from '../../../features/payments/payments.config';
import { PaymentEntity } from '../../../features/payments/domain/payment.entity';

@Injectable()
export class PaymentsClientService implements OnModuleInit {
	@Inject(PaymentConfig.name) private readonly paymentsConfig: PaymentConfig;
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

	async sendPaymentInfoToMicroservice(data: PaymentEntity) {
		try {
			return await this.client.send('create_payment', data).toPromise();
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
