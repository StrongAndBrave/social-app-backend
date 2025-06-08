import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsTCPClientService {
	@Inject('PAYMENTS_TCP_SERVICE') private paymentsTCPProxyClient: ClientProxy;

	async sendPaymentInfoToMicroservice(data: {
		userId: string;
		username: string;
		paymentPeriod: string;
		paymentService: string;
	}) {
		try {
			return await this.paymentsTCPProxyClient
				.send({ cmd: 'create_payment' }, data)
				.toPromise();
		} catch (error) {
			console.error('something wrong with create payment: ', error);
			return null;
		}
	}
}
