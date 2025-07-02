import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SubscriptionPayment } from '../domain/subscription.payment.entity';

@Injectable()
export class SubscriptionPaymentQueryRepository {
	constructor(
		@InjectModel(SubscriptionPayment)
		private readonly subscriptionPaymentModel: typeof SubscriptionPayment,
	) {}

	async getPaymentStory(userId: string): Promise<SubscriptionPayment[] | null> {
		const payments = await this.subscriptionPaymentModel.findAll({
			where: { userId: userId },
			attributes: { exclude: ['sessionId', 'subscriptionId', 'clientReferenceId'] },
		});
		return payments ?? null;
	}
}
