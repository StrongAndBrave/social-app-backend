import { Module } from '@nestjs/common';
import { PaymentsController } from './api/payments.controller';
import { CreateStripePaymentUseCase } from './application/use-cases/payments/create.stripe.payment.use-case';
import { PaymentsConfig } from './payments.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubscriptionPayment } from './domain/subscription.payment.entity';
import { CreateSubscriptionUseCase } from './application/use-cases/subscriptions/create.subscription.use-case';
import { SubscriptionPaymentsRepository } from './infrastructure/subscription.payment.repository';
import { FinishSubscriptionUseCase } from './application/use-cases/subscriptions/finish.subscription.use-case';
import { WebhookController } from './api/webhook.controller';
import { Subscription } from './domain/subscription.entity';
import { SubscriptionRepository } from './infrastructure/subscription.repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
	imports: [
		SequelizeModule.forFeature([SubscriptionPayment, Subscription]),
		DatabaseModule,
	],
	controllers: [PaymentsController, WebhookController],
	providers: [
		CreateStripePaymentUseCase,
		CreateSubscriptionUseCase,
		FinishSubscriptionUseCase,
		SubscriptionPaymentsRepository,
		SubscriptionRepository,
		PaymentsConfig,
	],
})
export class MicroservicePaymentsModule {}
