import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subscription } from '../domain/subscription.entity';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class SubscriptionRepository {
	constructor(
		@InjectModel(Subscription) private readonly subscriptionModel: typeof Subscription,
	) {}

	async createSubscription(
		data: CreationAttributes<Subscription>,
	): Promise<Subscription> {
		return this.subscriptionModel.create(data);
	}
}
