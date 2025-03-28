import { Module } from '@nestjs/common';
import { PaymentsController } from './api/payments.controller';
import { configModule } from '../../config/config-dynamic-module';
import { CreateStripePaymentUseCase } from './application/use-cases/create.stripe.payment.use-case';
import { CoreConfig } from '../../config/configuration';
import { CqrsModule } from '@nestjs/cqrs';
import { PaymentsConfig } from './payments.config';

@Module({
	imports: [configModule, CqrsModule],
	controllers: [PaymentsController],
	providers: [CreateStripePaymentUseCase, PaymentsConfig, CoreConfig],
})
export class MicroservicePaymentsModule {}
