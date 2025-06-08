import { Module } from '@nestjs/common';
import { PaymentTCPClientConfig } from './payment.client.config';

@Module({
	imports: [],
	providers: [PaymentTCPClientConfig],
	exports: [PaymentTCPClientConfig],
})
export class PaymentsTCPClientConfigModule {}
