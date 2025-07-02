import { Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsConfig } from '../payments.config';
import Stripe from 'stripe';
import { CommandBus } from '@nestjs/cqrs';
import { FinishSubscriptionCommand } from '../application/use-cases/subscriptions/finish.subscription.use-case';
import { UpdateAutoRenewalSubscriptionCommand } from '../application/use-cases/subscriptions/update.auto-renewal.subscription.use-case';

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
			return;
		}

		if (event.type === 'checkout.session.completed') {
			const session = event.data.object as Stripe.Checkout.Session;
			const clientReferenceId = session.client_reference_id;
			const subscriptionId = session.subscription;
			if (!clientReferenceId || !subscriptionId) {
				console.warn(
					'⚠️ No client_reference_id & subscriptionId found in session:',
					session.id,
				);
				return;
			}
			await this.commandBus.execute(
				new FinishSubscriptionCommand(clientReferenceId, subscriptionId.toString()),
			);
		}
	}

	@Post('subscription-auto-renewal')
	@HttpCode(200)
	async subscriptionAutoRenewal(@Req() req: Request) {
		const stripe = new Stripe(this.paymentsConfig.stripeSecretKey, {
			apiVersion: '2025-01-27.acacia',
		});
		const signature = req.headers['stripe-signature'];

		let event;
		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				signature as string[],
				this.paymentsConfig.stripeAutoRenewalSecretKey,
			);
		} catch (e) {
			console.error(e);
			return;
		}

		console.log('EVENT: ', JSON.stringify(event));

		if (event.type === 'customer.subscription.updated') {
			const subscription = event.data.object as Stripe.Subscription;
			const subscriptionId = subscription.id;
			if (!subscriptionId) {
				console.warn('⚠️ No subscriptionId found in session:', subscriptionId);
				return;
			}
			await this.commandBus.execute(
				new UpdateAutoRenewalSubscriptionCommand(
					subscriptionId,
					subscription.cancel_at_period_end,
				),
			);
		}
	}
}
