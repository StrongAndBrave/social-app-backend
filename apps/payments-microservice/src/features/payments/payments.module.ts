import { Module } from '@nestjs/common';
import { PaymentsController } from './api/payments.controller';
import { CreateStripePaymentUseCase } from './application/use-cases/create.stripe.payment.use-case';
import { PaymentsConfig } from './payments.config';
import { SubscriptionRepository } from './infrastructure/subscription.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subscription } from './domain/subscription.entity';
import { CreateSubscriptionUseCase } from './application/use-cases/create.subscription.use-case';

@Module({
	imports: [SequelizeModule.forFeature([Subscription])],
	controllers: [PaymentsController],
	providers: [
		CreateStripePaymentUseCase,
		CreateSubscriptionUseCase,
		SubscriptionRepository,
		PaymentsConfig,
	],
})
export class MicroservicePaymentsModule {}
