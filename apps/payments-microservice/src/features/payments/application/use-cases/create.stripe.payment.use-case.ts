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
		console.log(command.paymentPeriod);

		const session = await stripe.checkout.sessions.create({
			success_url: this.coreConfig.successPaymentResUrl,
			cancel_url: this.coreConfig.failurePaymentResUrl,
			line_items: [
				{
					price_data: {
						currency: 'USD',

						recurring: {
							interval: command.paymentPeriod,
						},
					},
				},
			],
			mode: 'subscription',
		});
	}
}
