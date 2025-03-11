import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CoreConfig } from '../../../../config/configuration';
import Stripe from 'stripe';

export class CreateStripePaymentCommand {
	constructor(
		public userId: string,
		public paymentPeriod: 'day' | 'week' | 'month' | 'year',
		public paymentService: string,
		public amount: number,
	) {}
}

@CommandHandler(CreateStripePaymentCommand)
export class CreateStripePaymentUseCase
	implements ICommandHandler<CreateStripePaymentCommand>
{
	constructor(private readonly coreConfig: CoreConfig) {}

	async execute(command: CreateStripePaymentCommand) {
		const stripe = new Stripe(this.coreConfig.stripeSecretKey, {
			apiVersion: '2025-01-27.acacia',
		});

		const session = await stripe.checkout.sessions.create({
			success_url: this.coreConfig.successPaymentResUrl,
			cancel_url: this.coreConfig.failurePaymentResUrl,
			line_items: [
				{
					price_data: {
						unit_amount: command.amount * 100,
						currency: 'USD',
						product_data: {
							name: 'Snapfolio',
							description: 'Subscription for business account',
						},
						recurring: {
							interval: command.paymentPeriod,
						},
					},
					quantity: 1,
				},
			],
			mode: 'subscription',
		});
		console.log(session);
		return session.url ?? null;
	}
}
