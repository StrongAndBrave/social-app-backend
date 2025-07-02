import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionRepository } from '../../../infrastructure/subscription.repository';
import { SubscriptionPaymentsRepository } from '../../../infrastructure/subscription.payment.repository';

export class UpdateAutoRenewalSubscriptionCommand {
	constructor(
		public subscriptionId: string,
		public autoRenewal: boolean,
	) {}
}

@CommandHandler(UpdateAutoRenewalSubscriptionCommand)
export class UpdateAutoRenewalSubscriptionUseCase
	implements ICommandHandler<UpdateAutoRenewalSubscriptionCommand>
{
	constructor(
		public readonly subscriptionRepository: SubscriptionRepository,
		public readonly subscriptionPaymentsRepository: SubscriptionPaymentsRepository,
	) {}

	async execute(command: UpdateAutoRenewalSubscriptionCommand): Promise<boolean> {
		const subscriptionPayment =
			await this.subscriptionPaymentsRepository.findSubscriptionPaymentBySubscriptionId(
				command.subscriptionId,
			);
		if (!subscriptionPayment) {
			return false;
		}
		const subscription = await this.subscriptionRepository.findSubscription(
			subscriptionPayment.userId,
		);
		if (!subscription) {
			return false;
		}
		try {
			const isAutoRenewalUpdated =
				await this.subscriptionRepository.updateSubscriptionAutoRenewal({
					userId: subscription.userId,
					autoRenewal: !command.autoRenewal,
				});
			return isAutoRenewalUpdated ?? null;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}
