import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionPaymentsRepository } from '../../../infrastructure/subscription.payment.repository';
import { SubscriptionRepository } from '../../../infrastructure/subscription.repository';
import { SubscriptionCreateModel } from '../../../api/models/input/payment.input.model';

export class FinishSubscriptionCommand {
	constructor(public clientReferenceId: string) {}
}

@CommandHandler(FinishSubscriptionCommand)
export class FinishSubscriptionUseCase
	implements ICommandHandler<FinishSubscriptionCommand>
{
	constructor(
		private readonly subscriptionPaymentsRepository: SubscriptionPaymentsRepository,
		private readonly subscriptionRepository: SubscriptionRepository,
	) {}

	async execute(command: FinishSubscriptionCommand): Promise<string | null> {
		try {
			const subscriptionPayment =
				await this.subscriptionPaymentsRepository.findSubscriptionPaymentByClientReferenceId(
					command.clientReferenceId,
				);
			if (!subscriptionPayment) {
				return null;
			}
			if (subscriptionPayment.status === 'pending')
				await this.subscriptionPaymentsRepository.changeSubscriptionPaymentStatus(
					subscriptionPayment.id,
					'succeeded',
				);

			let subscriptionExpDate = 0;

			switch (subscriptionPayment?.paymentPeriod) {
				case 'day':
					subscriptionExpDate = 1;
					break;
				case 'week':
					subscriptionExpDate = 7;
					break;
				case 'month':
					subscriptionExpDate = 30;
					break;
				case 'year':
					subscriptionExpDate = 365;
					break;
			}

			const subscriptionCreateData: Omit<SubscriptionCreateModel, 'autoRenewal'> = {
				userId: subscriptionPayment.userId,
				startAt: subscriptionPayment.updatedAt,
				expiredAt: new Date(Date.now() + subscriptionExpDate * 24 * 60 * 60 * 1000),
			};
			await this.subscriptionRepository.createSubscription(subscriptionCreateData);
			return subscriptionPayment!.id;
		} catch (e) {
			console.error(e);
			return null;
		}
	}
}
