import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PaymentConfig } from '../../../features/payments/payments.config';
import { PaymentInputModel } from '../../../features/payments/api/models/input/payment.input';

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

	async sendPaymentInfoToMicroservice(data: {
		userId: string;
		username: string;
		paymentPeriod: string;
		paymentService: string;
	}) {
		try {
			console.log('SendedData: ', data);
			return await this.client.send('create_payment', data).toPromise();
		} catch (error) {
			console.error('something wrong with create payment: ', error);
			return null;
		}
	}
}
