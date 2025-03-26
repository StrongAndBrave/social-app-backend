import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { CreateStripePaymentCommand } from '../application/use-cases/create.stripe.payment.use-case';
import { PaymentInputModel } from './models/input/payment.input.model';

@Controller()
export class PaymentsController {
	constructor(private commandBus: CommandBus) {}

	@MessagePattern('create_payment')
	async createPayment(data: PaymentInputModel) {
		console.log(data);
		if (data.paymentService === 'stripe') {
			console.log('data go to stripe payment');
			const paymentUrl = await this.commandBus.execute(
				new CreateStripePaymentCommand(data),
			);
			return paymentUrl ?? null;
		}
	}
}
