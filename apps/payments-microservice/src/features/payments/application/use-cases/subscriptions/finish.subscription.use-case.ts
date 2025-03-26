import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionRepository } from '../../../infrastructure/subscription.repository';

export class FinishSubscriptionCommand {
	constructor(public clientReferenceId: string) {}
}

@CommandHandler(FinishSubscriptionCommand)
export class FinishSubscriptionUseCase
	implements ICommandHandler<FinishSubscriptionCommand>
{
	constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

	async execute(command: FinishSubscriptionCommand): Promise<string | null> {
		try {
			const subscription =
				await this.subscriptionRepository.findSubscriptionByClientReferenceId(
					command.clientReferenceId,
				);
			if (subscription && subscription.status === 'pending')
				await this.subscriptionRepository.changeSubscriptionStatus(
					subscription.id,
					'succeeded',
				);
			return subscription!.id;
		} catch (e) {
			console.error(e);
			return null;
		}
	}
}
