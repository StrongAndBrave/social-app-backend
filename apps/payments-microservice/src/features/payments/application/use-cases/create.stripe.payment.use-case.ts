import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { PaymentsConfig } from '../../payments.config';

export class CreateStripePaymentCommand {
	constructor(
		public userId: string,
		public username: string,
		public paymentPeriod: 'day' | 'week' | 'month' | 'year',
		public paymentService: string,
	) {}
}

@CommandHandler(CreateStripePaymentCommand)
export class CreateStripePaymentUseCase
	implements ICommandHandler<CreateStripePaymentCommand>
{
	constructor(private readonly paymentsConfig: PaymentsConfig) {}

	async execute(command: CreateStripePaymentCommand) {
		let amount = 0;

		switch (command.paymentPeriod) {
			case 'day':
				amount = Number(this.paymentsConfig.daySubscriptionPrice);
				break;
			case 'week':
				amount = Number(this.paymentsConfig.weekSubscriptionPrice);
				break;
			case 'month':
				amount = Number(this.paymentsConfig.monthSubscriptionPrice);
				break;
			case 'year':
				amount = Number(this.paymentsConfig.yearSubscriptionPrice);
				break;
		}

		const stripe = new Stripe(this.paymentsConfig.stripeSecretKey, {
			apiVersion: '2025-01-27.acacia',
		});

		try {
			const session = await stripe.checkout.sessions.create({
				success_url: this.paymentsConfig.successPaymentResUrl,
				cancel_url: this.paymentsConfig.failurePaymentResUrl,
				line_items: [
					{
						price_data: {
							unit_amount: amount * 100,
							currency: 'USD',
							product_data: {
								name: 'Snapfolio',
								description: `1 ${command.paymentPeriod} business account subscription for ${command.username}`,
							},
							recurring: {
								interval: command.paymentPeriod,
							},
						},
						quantity: 1,
					},
				],
				mode: 'subscription',
				client_reference_id: command.userId,
			});

			console.log(session);
			return session.url;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}
}
