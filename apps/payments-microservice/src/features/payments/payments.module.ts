import { Module } from '@nestjs/common';
import { PaymentsController } from './api/payments.controller';
import { CreateStripePaymentUseCase } from './application/use-cases/create.stripe.payment.use-case';
import { PaymentsConfig } from './payments.config';
import { PaymentsRepository } from './infrastructure/payments.repository';

@Module({
	imports: [],
	controllers: [PaymentsController],
	providers: [CreateStripePaymentUseCase, PaymentsRepository, PaymentsConfig],
})
export class MicroservicePaymentsModule {}
