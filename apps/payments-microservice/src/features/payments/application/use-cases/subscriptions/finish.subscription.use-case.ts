import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionPaymentsRepository } from '../../../infrastructure/subscription.payment.repository';
import { SubscriptionRepository } from '../../../infrastructure/subscription.repository';
import { PaymentStatusEnum } from '../../../../../core/enums/payment.status.enum';
import { RmqService } from '../../../../../core/rmq-connections/rmq.service';

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
		private readonly rmqService: RmqService,
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
			const updateSubscriptionDate = new Date().toISOString();
			if (subscriptionPayment.status === PaymentStatusEnum.PENDING)
				await this.subscriptionPaymentsRepository.changeSubscriptionPaymentStatus(
					subscriptionPayment.id,
					PaymentStatusEnum.SUCCEEDED,
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

			const subscription = await this.subscriptionRepository.findSubscription(
				subscriptionPayment.userId,
			);

			if (subscription?.expiredAt) {
				await this.subscriptionRepository.addDateToSubscription(
					subscription!.userId,
					subscriptionExpDate * 24 * 60 * 60 * 1000,
				);
				const currentExpDate = new Date(subscription.expiredAt!);
				const newExpDate = new Date(
					currentExpDate.getTime() + subscriptionExpDate * 24 * 60 * 60 * 1000,
				).toISOString();
				await this.rmqService.sendSubscriberData({
					userId: subscriptionPayment.userId,
					accountType: 'Business',
					subscriptionPeriod: newExpDate,
				});
				return subscriptionPayment.id;
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

			await this.rmqService.sendSubscriberData({
				userId: subscriptionPayment.userId,
				accountType: 'Business',
				subscriptionPeriod: new Date(
					Date.now() + subscriptionExpDate * 24 * 60 * 60 * 1000,
				).toISOString(),
			});

			return subscriptionPayment!.id;
		} catch (e) {
			console.error(e);
			return null;
		}
	}
}
