import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsClientService {
	@Inject('PAYMENTS_SERVICE') private paymentsProxyClient: ClientProxy;

	async sendPaymentInfoToMicroservice(data: {
		userId: string;
		username: string;
		paymentPeriod: string;
		paymentService: string;
	}) {
		try {
			console.log('SendedData: ', data);
			return await this.paymentsProxyClient
				.send({ cmd: 'create_payment' }, data)
				.toPromise();
		} catch (error) {
			console.error('something wrong with create payment: ', error);
			return null;
		}
	}
}
