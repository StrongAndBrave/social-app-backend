import { Module } from '@nestjs/common';
import { PaymentsController } from './api/payments.controller';
import { ConfigModule } from '@nestjs/config';
import { configModule } from '../../config/config-dynamic-module';
import { CreateStripePaymentUseCase } from './application/use-cases/create.stripe.payment.use-case';
import { CoreConfig } from '../../config/configuration';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), configModule, CqrsModule],
	controllers: [PaymentsController],
	providers: [CreateStripePaymentUseCase, CoreConfig],
})
export class MicroservicePaymentsModule {}
