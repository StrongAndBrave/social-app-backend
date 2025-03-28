import { Module } from '@nestjs/common';
import { PaymentsController } from './api/payments.controller';
import { CreateStripePaymentUseCase } from './application/use-cases/create.stripe.payment.use-case';
import { PaymentsConfig } from './payments.config';

@Module({
	imports: [],
	controllers: [PaymentsController],
	providers: [CreateStripePaymentUseCase, PaymentsConfig],
})
export class MicroservicePaymentsModule {}
