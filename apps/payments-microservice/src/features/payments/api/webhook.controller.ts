import {
	Body,
	Controller,
	HttpCode,
	InternalServerErrorException,
	Post,
	Req,
} from '@nestjs/common';
import { PaymentsConfig } from '../payments.config';
import Stripe from 'stripe';
import { CommandBus } from '@nestjs/cqrs';
import { FinishSubscriptionCommand } from '../application/use-cases/subscriptions/finish.subscription.use-case';
import { FailureSubscriptionCommand } from '../application/use-cases/subscriptions/failure.subscription.use-case';

@Controller('payments')
export class WebhookController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly paymentsConfig: PaymentsConfig,
	) {}

	@Post('stripe-webhook')
	@HttpCode(200)
	async stripeWebhook(@Body() data: any, @Req() req: Request) {
		const stripe = new Stripe(this.paymentsConfig.stripeSecretKey, {
			apiVersion: '2025-01-27.acacia',
		});
		const signature = req.headers['stripe-signature'];
		if (!signature || data) {
			throw new InternalServerErrorException();
		}
		try {
			const event = stripe.webhooks.constructEvent(
				data,
				signature,
				this.paymentsConfig.stripeWebhookSecretKey,
			);
			if (event.type === 'checkout.session.completed') {
				const session = event.data.object as Stripe.Checkout.Session;
				await this.commandBus.execute(
					new FinishSubscriptionCommand(session.client_reference_id!),
				);
			} else {
				const session = event.data.object as Stripe.Checkout.Session;
				await this.commandBus.execute(
					new FailureSubscriptionCommand(session.client_reference_id!),
				);
			}
		} catch (e) {
			console.error(e);
		}
	}
}
