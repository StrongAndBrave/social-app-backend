import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionPaymentsRepository } from '../../../infrastructure/subscription.payment.repository';
import { SubscriptionRepository } from '../../../infrastructure/subscription.repository';

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
			console.log('subscriptionPayment', subscriptionPayment);
			if (!subscriptionPayment) {
				return null;
			}
			const updateSubscriptionDate = new Date().toISOString();
			if (subscriptionPayment.status === 'pending')
				await this.subscriptionPaymentsRepository.changeSubscriptionPaymentStatus(
					subscriptionPayment.id,
					'succeeded',
					updateSubscriptionDate,
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

			const data = {
				startAt: updateSubscriptionDate,
				expiredAt: new Date(
					Date.now() + subscriptionExpDate * 24 * 60 * 60 * 1000,
				).toISOString(),
			};

			await this.subscriptionRepository.updateSubscription(
				subscriptionPayment.userId,
				data,
			);
			return subscriptionPayment!.id;
		} catch (e) {
			console.error(e);
			return null;
		}
	}
}
