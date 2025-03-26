import {
	PaymentInputModel,
	SubscriptionCreateModel,
} from '../../api/models/input/payment.input.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionRepository } from '../../infrastructure/subscription.repository';

export class CreateSubscriptionCommand {
	constructor(
		public paymentData: PaymentInputModel,
		public amount: number,
	) {}
}

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionUseCase
	implements ICommandHandler<CreateSubscriptionCommand>
{
	constructor(private readonly paymentsRepository: SubscriptionRepository) {}

	async execute(command: CreateSubscriptionCommand) {
		const subscriptionCreateData: Omit<SubscriptionCreateModel, 'status'> = {
			...command.paymentData,
			price: command.amount,
		};

		const addedSubscription =
			await this.paymentsRepository.createSubscription(subscriptionCreateData);

		return addedSubscription ?? null;
	}
}
