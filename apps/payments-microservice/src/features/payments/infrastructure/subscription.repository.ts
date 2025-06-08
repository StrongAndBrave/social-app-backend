import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subscription } from '../domain/subscription.entity';
import { AutoRenewalInputModel } from '../api/models/input/payment.input.model';

@Injectable()
export class SubscriptionRepository {
	constructor(
		@InjectModel(Subscription) private readonly subscriptionModel: typeof Subscription,
	) {}

	async findSubscription(userId: string): Promise<Subscription | null> {
		return this.subscriptionModel.findOne({ where: { userId: userId } });
	}

	async addDateToSubscription(
		userId: string,
		msToAdd: number,
	): Promise<Subscription | null> {
		const subscription = await this.subscriptionModel.findOne({
			where: { userId: userId },
		});
		if (!subscription) {
			return null;
		}
		const currentExpDate = new Date(subscription.expiredAt!);
		const newExpDate = new Date(currentExpDate.getTime() + msToAdd);
		console.log('newExpDate: ', newExpDate);
		subscription.expiredAt = newExpDate.toISOString();
		await subscription.save();
		return subscription;
	}

	async updateSubscription(
		userId: string,
		data: { startAt: string; expiredAt: string },
	): Promise<Subscription | null> {
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

	async updateSubscriptionAutoRenewal(data: AutoRenewalInputModel): Promise<boolean> {
		const subscription = await this.subscriptionModel.findOne({
			where: { userId: data.userId },
		});
		if (!subscription) {
			return false;
		}
		subscription.autoRenewal = data.autoRenewal;
		await subscription.save();
		return true;
	}
}
