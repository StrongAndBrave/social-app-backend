import { AutoRenewalInputModel } from '../../../api/models/input/payment.input.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionRepository } from '../../../infrastructure/subscription.repository';

export class UpdateAutoRenewalSubscriptionCommand {
	constructor(public data: AutoRenewalInputModel) {}
}

@CommandHandler(UpdateAutoRenewalSubscriptionCommand)
export class UpdateAutoRenewalSubscriptionUseCase
	implements ICommandHandler<UpdateAutoRenewalSubscriptionCommand>
{
	constructor(public readonly subscriptionRepository: SubscriptionRepository) {}

	async execute(command: UpdateAutoRenewalSubscriptionCommand): Promise<boolean> {
		try {
			const isUpdated = await this.subscriptionRepository.updateSubscriptionAutoRenewal(
				command.data,
			);
			return !isUpdated;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}
