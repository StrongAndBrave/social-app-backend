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
import { RmqModule } from '../../core/rmq-connections/rmq.module';
import { RmqService } from '../../core/rmq-connections/rmq.service';
import { UpdateAutoRenewalSubscriptionUseCase } from './application/use-cases/subscriptions/update.auto-renewal.subscription.use-case';

@Module({
	imports: [
		SequelizeModule.forFeature([SubscriptionPayment, Subscription]),
		DatabaseModule,
		RmqModule,
	],
	controllers: [PaymentsController, WebhookController],
	providers: [
		CreateStripePaymentUseCase,
		CreateSubscriptionUseCase,
		FinishSubscriptionUseCase,
		UpdateAutoRenewalSubscriptionUseCase,
		SubscriptionPaymentsRepository,
		SubscriptionRepository,
		PaymentsConfig,
		RmqService,
	],
})
export class MicroservicePaymentsModule {}
