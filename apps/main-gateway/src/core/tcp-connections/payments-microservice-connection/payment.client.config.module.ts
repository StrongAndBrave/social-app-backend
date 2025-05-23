import { Module } from '@nestjs/common';
import { PaymentClientConfig } from './payment.client.config';

@Module({
	imports: [],
	providers: [PaymentClientConfig],
	exports: [PaymentClientConfig],
})
export class PaymentsClientConfigModule {}
