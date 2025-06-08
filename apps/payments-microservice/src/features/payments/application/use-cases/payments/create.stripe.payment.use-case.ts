import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { PaymentsConfig } from '../../../payments.config';
import { PaymentInputModel } from '../../../api/models/input/payment.input.model';
import { CreateSubscriptionPaymentCommand } from '../subscriptions/create.subscription.use-case';
import { v4 as uuidv4 } from 'uuid';

export class CreateStripePaymentCommand {
	constructor(public paymentData: PaymentInputModel) {}
}

@CommandHandler(CreateStripePaymentCommand)
export class CreateStripePaymentUseCase
	implements ICommandHandler<CreateStripePaymentCommand>
{
	constructor(
		private readonly paymentsConfig: PaymentsConfig,
		private readonly commandBus: CommandBus,
	) {}

	async execute(command: CreateStripePaymentCommand): Promise<string | null> {
		let amount = 0;

		switch (command.paymentData.paymentPeriod) {
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

		const clientReferenceId: string = uuidv4();

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
								description: `1 ${command.paymentData.paymentPeriod} business account subscription for ${command.paymentData.username}`,
							},
							recurring: {
								interval: command.paymentData.paymentPeriod,
							},
						},
						quantity: 1,
					},
				],
				mode: 'subscription',
				client_reference_id: clientReferenceId,
			});

			const newSubscriptionPayment = await this.commandBus.execute(
				new CreateSubscriptionPaymentCommand(
					session.id,
					command.paymentData,
					amount,
					clientReferenceId,
				),
			);

			return session && newSubscriptionPayment ? session.url : null;
		} catch (e) {
			console.error(e);
			return null;
		}
	}
}
