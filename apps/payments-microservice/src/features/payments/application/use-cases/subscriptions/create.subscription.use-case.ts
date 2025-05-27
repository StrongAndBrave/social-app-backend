import {
	PaymentInputModel,
	SubscriptionCreateModel,
	SubscriptionPaymentCreateModel,
} from '../../../api/models/input/payment.input.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionPaymentsRepository } from '../../../infrastructure/subscription.payment.repository';
import { SubscriptionRepository } from '../../../infrastructure/subscription.repository';

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
		private readonly subscriptionRepository: SubscriptionRepository,
	) {}

	async execute(command: CreateSubscriptionPaymentCommand) {
		const subscription = await this.subscriptionRepository.findSubscription(
			command.paymentData.userId,
		);

		console.log('subscriptionIsExist: ', subscription);

		const subscriptionPaymentCreateData: Omit<SubscriptionPaymentCreateModel, 'status'> =
			{
				...command.paymentData,
				price: command.amount,
				clientReferenceId: command.clientReferenceId,
			};

		if (!subscription) {
			const newSubscriptionPayment =
				await this.subscriptionPaymentsRepository.addNewSubscriptionPaymentData(
					subscriptionPaymentCreateData,
				);
			return newSubscriptionPayment ?? null;
		}

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
