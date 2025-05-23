import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentClientConfig } from './payment.client.config';
import { PaymentsClientConfigModule } from './payment.client.config.module';
import { PaymentsClientService } from './payment.client.service';

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: 'PAYMENTS_SERVICE',
				inject: [PaymentClientConfig],
				imports: [PaymentsClientConfigModule],
				useFactory: (paymentClientConfig: PaymentClientConfig) => ({
					transport: Transport.TCP,
					options: {
						host: paymentClientConfig.paymentsServiceHost,
						port: paymentClientConfig.paymentsServicePort,
					},
				}),
			},
		]),
	],
	providers: [PaymentClientConfig, PaymentsClientService],
	exports: [PaymentsClientService, ClientsModule],
})
export class PaymentsClientModule {}
