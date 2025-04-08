import { Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsConfig } from '../payments.config';
import Stripe from 'stripe';
import { CommandBus } from '@nestjs/cqrs';
import { FinishSubscriptionCommand } from '../application/use-cases/subscriptions/finish.subscription.use-case';

@Controller('payments')
export class WebhookController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly paymentsConfig: PaymentsConfig,
	) {}

	@Post('stripe-webhook')
	@HttpCode(200)
	async stripeWebhook(@Req() req: Request) {
		const stripe = new Stripe(this.paymentsConfig.stripeSecretKey, {
			apiVersion: '2025-01-27.acacia',
		});
		const signature = req.headers['stripe-signature'];

		let event;
		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				signature as string[],
				this.paymentsConfig.stripeWebhookSecretKey,
			);
		} catch (e) {
			console.error(e);
		}

		console.log(`EVENT: ${JSON.stringify(event.type)}`);

		if (event.type === 'checkout.session.completed') {
			const session = event.data.object as Stripe.Checkout.Session;
			const clientReferenceId = session.client_reference_id;
			if (!clientReferenceId) {
				console.warn('⚠️ No client_reference_id found in session:', session.id);
				return;
			}
			await this.commandBus.execute(new FinishSubscriptionCommand(clientReferenceId));
		}
	}
}
