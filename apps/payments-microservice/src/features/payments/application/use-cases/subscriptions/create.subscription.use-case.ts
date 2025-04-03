import {
	PaymentInputModel,
	SubscriptionCreateModel,
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

		const subscriptionCreateData: Omit<SubscriptionCreateModel, 'autoRenewal'> = {
			userId: command.paymentData.userId,
			startAt: null,
			expiredAt: null,
		};

		console.log(
			`subscriptionPaymentCreateData: ${JSON.stringify(subscriptionPaymentCreateData)}`,
			`subscriptionCreateData: ${JSON.stringify(subscriptionCreateData)}`,
		);

		const addedSubscriptionNPayment =
			await this.subscriptionPaymentsRepository.createSubscriptionPaymentWithSubscription(
				subscriptionCreateData,
				subscriptionPaymentCreateData,
			);

		return addedSubscriptionNPayment ?? null;
	}
}
