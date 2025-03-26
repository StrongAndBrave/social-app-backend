import { Body, Controller, Post } from '@nestjs/common';

@Controller('payments')
export class WebhookController {
	constructor() {}

	@Post('stripe-webhook')
	async stripeWebhook(@Body() data: unknown) {}
}
