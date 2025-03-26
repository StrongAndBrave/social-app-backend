import { Module } from '@nestjs/common';
import { PaymentsController } from './api/payments.controller';
import { CreateStripePaymentUseCase } from './application/use-cases/payments/create.stripe.payment.use-case';
import { PaymentsConfig } from './payments.config';
import { SubscriptionRepository } from './infrastructure/subscription.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subscription } from './domain/subscription.entity';
import { CreateSubscriptionUseCase } from './application/use-cases/subscriptions/create.subscription.use-case';
import { WebhookController } from './api/webhook.controller';
import { FailureSubscriptionUseCase } from './application/use-cases/subscriptions/failure.subscription.use-case';
import { FinishSubscriptionUseCase } from './application/use-cases/subscriptions/finish.subscription.use-case';

@Module({
	imports: [SequelizeModule.forFeature([Subscription])],
	controllers: [PaymentsController, WebhookController],
	providers: [
		CreateStripePaymentUseCase,
		CreateSubscriptionUseCase,
		FailureSubscriptionUseCase,
		FinishSubscriptionUseCase,
		SubscriptionRepository,
		PaymentsConfig,
	],
})
export class MicroservicePaymentsModule {}
