import {
	PaymentInputModel,
	SubscriptionPaymentCreateModel,
} from '../../../api/models/input/payment.input.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionPaymentsRepository } from '../../../infrastructure/subscription.payment.repository';

export class CreateSubscriptionPaymentCommand {
	constructor(
		public paymentData: PaymentInputModel,
		public amount: number,
		public clientReferenceId: string,
	) {}
}

@CommandHandler(CreateSubscriptionPaymentCommand)
export class CreateSubscriptionUseCase
	implements ICommandHandler<CreateSubscriptionPaymentCommand>
{
	constructor(
		private readonly subscriptionPaymentsRepository: SubscriptionPaymentsRepository,
	) {}

	async execute(command: CreateSubscriptionPaymentCommand) {
		const subscriptionPaymentCreateData: Omit<SubscriptionPaymentCreateModel, 'status'> =
			{
				...command.paymentData,
				price: command.amount,
				clientReferenceId: command.clientReferenceId,
			};

		console.log(
			`subscriptionCreateData: ${JSON.stringify(subscriptionPaymentCreateData)}`,
		);

		const addedSubscriptionPayment =
			await this.subscriptionPaymentsRepository.createSubscriptionPayment(
				subscriptionPaymentCreateData,
			);

		console.log(`New subscription: ${JSON.stringify(addedSubscriptionPayment)}`);

		return addedSubscriptionPayment ?? null;
	}
}
