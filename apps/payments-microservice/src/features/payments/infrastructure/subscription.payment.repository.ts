import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SubscriptionPayment } from '../domain/subscription.payment.entity';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class SubscriptionPaymentsRepository {
	constructor(
		@InjectModel(SubscriptionPayment)
		private readonly subscriptionPaymentModel: typeof SubscriptionPayment,
	) {}

	async createSubscriptionPayment(
		data: CreationAttributes<SubscriptionPayment>,
	): Promise<SubscriptionPayment> {
		return this.subscriptionPaymentModel.create(data);
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
