import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { PaymentsConfig } from '../payments.config';
import Stripe from 'stripe';

@Controller('payments')
export class WebhookController {
	constructor(private readonly paymentsConfig: PaymentsConfig) {}

	@Post('stripe-webhook')
	@HttpCode(200)
	async stripeWebhook(@Body() data: any, @Req() req: Request) {
		const stripe = new Stripe(this.paymentsConfig.stripeSecretKey, {
			apiVersion: '2025-01-27.acacia',
		});
		const signature = req.headers['stripe-signature'];
		try {
			const event = stripe.webhooks.constructEvent(
				data,
				signature,
				this.paymentsConfig.stripeWebhookSecretKey,
			);
		} catch (e) {
			console.error(e);
		}
	}
}
