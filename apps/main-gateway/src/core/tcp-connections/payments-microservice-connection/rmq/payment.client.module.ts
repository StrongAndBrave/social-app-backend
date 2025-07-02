/*
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentRMQClientConfig } from './payment.client.config';
import { PaymentsRMQClientConfigModule } from './payment.client.config.module';
import { PaymentsRMQClientService } from './payment.client.service';

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: 'PAYMENTS_RMQ_SERVICE',
				inject: [PaymentRMQClientConfig],
				imports: [PaymentsRMQClientConfigModule],
				useFactory: (paymentClientConfig: PaymentRMQClientConfig) => ({
					transport: Transport.RMQ,
					options: {
						urls: [paymentClientConfig.rmqUrl],
						queue: paymentClientConfig.rmqQueue,
						noAck: false,
						queueOptions: {
							durable: true,
						},
					},
				}),
			},
		]),
	],
	providers: [PaymentRMQClientConfig, PaymentsRMQClientService],
	exports: [PaymentsRMQClientService, ClientsModule],
})
export class PaymentsRMQClientModule {}
*/
