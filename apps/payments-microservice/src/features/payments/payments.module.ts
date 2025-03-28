import { Module } from '@nestjs/common';
import { PaymentsController } from './api/payments.controller';
import { CreateStripePaymentUseCase } from './application/use-cases/payments/create.stripe.payment.use-case';
import { PaymentsConfig } from './payments.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subscription } from './domain/subscription.entity';

@Module({
	imports: [SequelizeModule.forFeature([Subscription])],
	controllers: [PaymentsController],
	providers: [CreateStripePaymentUseCase, PaymentsConfig],
})
export class MicroservicePaymentsModule {}
