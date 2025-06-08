import { AutoRenewalInputModel } from '../../../api/models/input/payment.input.model';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionRepository } from '../../../infrastructure/subscription.repository';
import { UpdateStripeAutoRenewalSubscriptionCommand } from '../payments/stripe/update.stripe.auto-renewal.subsctiption.use-case';

export class UpdateAutoRenewalSubscriptionCommand {
	constructor(public data: AutoRenewalInputModel) {}
}

@CommandHandler(UpdateAutoRenewalSubscriptionCommand)
export class UpdateAutoRenewalSubscriptionUseCase
	implements ICommandHandler<UpdateAutoRenewalSubscriptionCommand>
{
	constructor(
		public readonly subscriptionRepository: SubscriptionRepository,
		private readonly commandBus: CommandBus,
	) {}

	async execute(command: UpdateAutoRenewalSubscriptionCommand): Promise<boolean> {
		const subscription = await this.subscriptionRepository.findSubscription(
			command.data.userId,
		);
		if (!subscription) {
			return false;
		}
		try {
			const isSubscriptionUpdated =
				await this.subscriptionRepository.updateSubscriptionAutoRenewal(command.data);
			const isPaymentSubscriptionUpdated = await this.commandBus.execute(
				new UpdateStripeAutoRenewalSubscriptionCommand(
					command.data.userId,
					command.data.autoRenewal,
				),
			);
			return !!(isSubscriptionUpdated && isPaymentSubscriptionUpdated);
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}
