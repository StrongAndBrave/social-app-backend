import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subscription } from '../domain/subscription.entity';

@Injectable()
export class SubscriptionRepository {
	constructor(
		@InjectModel(Subscription) private readonly subscriptionModel: typeof Subscription,
	) {}

	async updateSubscription(userId: string, data: { startAt: string; expiredAt: string }) {
		const subscription = await this.subscriptionModel.findOne({
			where: { userId: userId },
		});

		if (!subscription) {
			return null;
		}
		subscription.startAt = data.startAt;
		subscription.expiredAt = data.expiredAt;
		await subscription.save();
		return subscription;
	}
}
