import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { SubscriptionPayment } from '../domain/subscription.payment.entity';
import { CreationAttributes, Sequelize } from 'sequelize';
import { Subscription } from '../domain/subscription.entity';

@Injectable()
export class SubscriptionPaymentsRepository {
	constructor(
		@InjectModel(SubscriptionPayment)
		private readonly subscriptionPaymentModel: typeof SubscriptionPayment,
		@InjectModel(Subscription) private readonly subscriptionModel: typeof Subscription,
		@InjectConnection() private readonly sequelize: Sequelize,
	) {}

	async createSubscriptionPaymentWithSubscription(
		subscriptionData: CreationAttributes<Subscription>,
		subscriptionPaymentData: CreationAttributes<SubscriptionPayment>,
	): Promise<boolean> {
		try {
			return await this.sequelize.transaction(async (t) => {
				const newSubscription = await this.subscriptionModel.create(subscriptionData, {
					transaction: t,
				});

				const newSubscriptionPayment = await this.subscriptionPaymentModel.create(
					subscriptionPaymentData,
					{ transaction: t },
				);

				return !!(newSubscription && newSubscriptionPayment);
			});
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	async findSubscriptionPaymentByClientReferenceId(
		clientReferenceId: string,
	): Promise<SubscriptionPayment | null> {
		const subscription = this.subscriptionPaymentModel.findOne({
			where: { clientReferenceId: clientReferenceId },
		});
		return subscription ?? null;
	}

	async changeSubscriptionPaymentStatus(id: string, newStatus: string): Promise<boolean> {
		const subscription = await this.subscriptionPaymentModel.update(
			{ status: newStatus, updatedAt: null },
			{ where: { id: id } },
		);
		return !!subscription;
	}
}
