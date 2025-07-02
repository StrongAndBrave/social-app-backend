import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentTCPClientConfig } from './payment.client.config';
import { PaymentsTCPClientConfigModule } from './payment.client.config.module';
import { PaymentsTCPClientService } from './payment.client.service';

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: 'PAYMENTS_TCP_SERVICE',
				inject: [PaymentTCPClientConfig],
				imports: [PaymentsTCPClientConfigModule],
				useFactory: (paymentClientConfig: PaymentTCPClientConfig) => ({
					transport: Transport.TCP,
					options: {
						host: paymentClientConfig.paymentsServiceHost,
						port: paymentClientConfig.paymentsServicePort,
					},
				}),
			},
		]),
	],
	providers: [PaymentTCPClientConfig, PaymentsTCPClientService],
	exports: [PaymentsTCPClientService, ClientsModule],
})
export class PaymentsTCPClientModule {}
