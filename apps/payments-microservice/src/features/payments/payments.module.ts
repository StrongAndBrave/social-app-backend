import { Module } from '@nestjs/common';
import { PaymentsController } from './api/payments.controller';
import { CreateStripePaymentUseCase } from './application/use-cases/create.stripe.payment.use-case';
import { PaymentsConfig } from './payments.config';
import { CoreConfig } from '../../config/configuration';

@Module({
	imports: [],
	controllers: [PaymentsController],
	providers: [CreateStripePaymentUseCase, PaymentsConfig, CoreConfig],
})
export class MicroservicePaymentsModule {}
