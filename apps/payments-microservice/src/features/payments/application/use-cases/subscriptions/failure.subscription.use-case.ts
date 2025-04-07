import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionPaymentsRepository } from '../../../infrastructure/subscription.payment.repository';

export class FailureSubscriptionCommand {
	constructor(public clientReferenceId: string) {}
}

@CommandHandler(FailureSubscriptionCommand)
export class FailureSubscriptionUseCase
	implements ICommandHandler<FailureSubscriptionCommand>
{
	constructor(public subscriptionPaymentsRepository: SubscriptionPaymentsRepository) {}

	async execute(command: FailureSubscriptionCommand) {
		try {
			const subscription =
				await this.subscriptionPaymentsRepository.findSubscriptionPaymentByClientReferenceId(
					command.clientReferenceId,
				);
			if (!subscription) {
				return null;
			}
			const updateSubscriptionDate = new Date().toISOString();
			await this.subscriptionPaymentsRepository.changeSubscriptionPaymentStatus(
				subscription.id,
				'failure',
				updateSubscriptionDate,
			);
		} catch (e) {
			console.error(e);
			return null;
		}
	}
}
