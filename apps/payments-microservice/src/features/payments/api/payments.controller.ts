import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import {
	AutoRenewalInputModel,
	PaymentInputModel,
} from './models/input/payment.input.model';
import { CreateStripePaymentCommand } from '../application/use-cases/payments/stripe/create.stripe.payment.use-case';
import { UpdateStripeAutoRenewalSubscriptionCommand } from '../application/use-cases/payments/stripe/update.stripe.auto-renewal.subsctiption.use-case';
import { SubscriptionPaymentQueryRepository } from '../infrastructure/subscription.payment.query.repository';

@Controller()
export class PaymentsController {
	constructor(
		private commandBus: CommandBus,
		private readonly subscriptionPaymentQueryRepository: SubscriptionPaymentQueryRepository,
	) {}

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

	@MessagePattern({ cmd: 'auto_renewal' })
	async updateAutoRenewal(data: AutoRenewalInputModel) {
		return this.commandBus.execute(new UpdateStripeAutoRenewalSubscriptionCommand(data));
	}

	@MessagePattern({ cmd: 'get_payments' })
	async getPayments(userId: string) {
		return this.subscriptionPaymentQueryRepository.getPaymentStory(userId);
	}
}
