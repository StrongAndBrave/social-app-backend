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

	async findSubscriptionByClientReferenceId(
		clientReferenceId: string,
	): Promise<Subscription | null> {
		const subscription = this.subscriptionModel.findOne({
			where: { clientReferenceId: clientReferenceId },
		});
		return subscription ?? null;
	}

	async changeSubscriptionStatus(id: string, newStatus: string): Promise<boolean> {
		const subscription = await this.subscriptionModel.update(
			{ status: newStatus, updatedAt: null },
			{ where: { id: id } },
		);
		return !!subscription;
	}
}
