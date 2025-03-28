import { Module } from '@nestjs/common';
import { PaymentsController } from './api/payments.controller';
import { CreateStripePaymentUseCase } from './application/use-cases/payments/create.stripe.payment.use-case';
import { PaymentsConfig } from './payments.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subscription } from './domain/subscription.entity';
import { CreateSubscriptionUseCase } from './application/use-cases/subscriptions/create.subscription.use-case';
import { SubscriptionRepository } from './infrastructure/subscription.repository';
import { FinishSubscriptionUseCase } from './application/use-cases/subscriptions/finish.subscription.use-case';
import { FailureSubscriptionUseCase } from './application/use-cases/subscriptions/failure.subscription.use-case';
import { WebhookController } from './api/webhook.controller';

@Module({
	imports: [SequelizeModule.forFeature([Subscription])],
	controllers: [PaymentsController, WebhookController],
	providers: [
		CreateStripePaymentUseCase,
		CreateSubscriptionUseCase,
		FinishSubscriptionUseCase,
		FailureSubscriptionUseCase,
		SubscriptionRepository,
		PaymentsConfig,
	],
})
export class MicroservicePaymentsModule {}
