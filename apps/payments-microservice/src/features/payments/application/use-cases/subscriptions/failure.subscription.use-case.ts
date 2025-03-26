import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionRepository } from '../../../infrastructure/subscription.repository';

export class FailureSubscriptionCommand {
	constructor(public clientReferenceId: string) {}
}

@CommandHandler(FailureSubscriptionCommand)
export class FailureSubscriptionUseCase
	implements ICommandHandler<FailureSubscriptionCommand>
{
	constructor(public subscriptionRepository: SubscriptionRepository) {}

	async execute(command: FailureSubscriptionCommand) {
		try {
			const subscription =
				await this.subscriptionRepository.findSubscriptionByClientReferenceId(
					command.clientReferenceId,
				);
			if (!subscription) {
				return null;
			}
			await this.subscriptionRepository.changeSubscriptionStatus(
				subscription.id,
				'failure',
			);
		} catch (e) {
			console.error(e);
			return null;
		}
	}
}
