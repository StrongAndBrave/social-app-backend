import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionPaymentsRepository } from '../../../../infrastructure/subscription.payment.repository';
import { PaymentsConfig } from '../../../../payments.config';
import Stripe from 'stripe';

export class UpdateStripeAutoRenewalSubscriptionCommand {
	constructor(
		public userId: string,
		public autoRenewal: boolean,
	) {}
}

@CommandHandler(UpdateStripeAutoRenewalSubscriptionCommand)
export class UpdateStripeAutoRenewalSubscriptionUseCase
	implements ICommandHandler<UpdateStripeAutoRenewalSubscriptionCommand>
{
	constructor(
		private readonly subscriptionPaymentRepository: SubscriptionPaymentsRepository,
		private readonly paymentsConfig: PaymentsConfig,
	) {}

	async execute(command: UpdateStripeAutoRenewalSubscriptionCommand): Promise<boolean> {
		const sessionId =
			await this.subscriptionPaymentRepository.findSubscriptionPaymentSessionIdByUserId(
				command.userId,
			);
		if (!sessionId) {
			return false;
		}
		const stripe = new Stripe(this.paymentsConfig.stripeSecretKey, {
			apiVersion: '2025-01-27.acacia',
		});
		try {
			const updateAutoRenewal = await stripe.subscriptions.update(sessionId, {
				cancel_at_period_end: command.autoRenewal,
			});
			return !!updateAutoRenewal;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}
