import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { CreateStripePaymentCommand } from '../application/use-cases/create.stripe.payment.use-case';

@Controller()
export class PaymentsController {
	constructor(private commandBus: CommandBus) {}

	@MessagePattern('create_payment')
	async createPayment(data: {
		userId: string;
		paymentPeriod: 'day' | 'week' | 'month' | 'year';
		paymentService: string;
		amount: number;
	}) {
		console.log(data);
		if (data.paymentService === 'STRIPE') {
			console.log('data go to stripe payment');
			await this.commandBus.execute(
				new CreateStripePaymentCommand(
					data.userId,
					data.paymentPeriod,
					data.paymentService,
					data.amount,
				),
			);
		}
	}
}
