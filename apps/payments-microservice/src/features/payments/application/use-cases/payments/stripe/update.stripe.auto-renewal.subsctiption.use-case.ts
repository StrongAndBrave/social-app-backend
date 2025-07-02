import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionPaymentsRepository } from '../../../../infrastructure/subscription.payment.repository';
import { PaymentsConfig } from '../../../../payments.config';
import Stripe from 'stripe';
import { AutoRenewalInputModel } from '../../../../api/models/input/payment.input.model';

export class UpdateStripeAutoRenewalSubscriptionCommand {
	constructor(public data: AutoRenewalInputModel) {}
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
		const stripeSubscriptionId =
			await this.subscriptionPaymentRepository.findSubscriptionPaymentStripeSubscriptionIdByUserId(
				command.data.userId,
			);
		if (!stripeSubscriptionId) {
			return false;
		}
		const stripe = new Stripe(this.paymentsConfig.stripeSecretKey, {
			apiVersion: '2025-01-27.acacia',
		});
		try {
			const updateAutoRenewal = await stripe.subscriptions.update(stripeSubscriptionId, {
				cancel_at_period_end: !command.data.autoRenewal,
			});
			return !!updateAutoRenewal;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}
