import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import {
	AutoRenewalInputModel,
	PaymentInputModel,
} from './models/input/payment.input.model';
import { CreateStripePaymentCommand } from '../application/use-cases/payments/create.stripe.payment.use-case';
import { UpdateAutoRenewalSubscriptionCommand } from '../application/use-cases/subscriptions/update.auto-renewal.subscription.use-case';

@Controller()
export class PaymentsController {
	constructor(private commandBus: CommandBus) {}

	@MessagePattern({ cmd: 'create_payment' })
	async createPayment(data: PaymentInputModel) {
		if (data.paymentService === 'stripe') {
			console.log('data go to stripe payment');
			const paymentUrl = await this.commandBus.execute(
				new CreateStripePaymentCommand(data),
			);
			return paymentUrl ?? null;
		}
	}

	@MessagePattern({ cmd: 'autoRenewal' })
	async updateAutoRenewal(data: AutoRenewalInputModel) {
		const isUpdated = await this.commandBus.execute(
			new UpdateAutoRenewalSubscriptionCommand(data),
		);

		return !isUpdated;
	}
}
