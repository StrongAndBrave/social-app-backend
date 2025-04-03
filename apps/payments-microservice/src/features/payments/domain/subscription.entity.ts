import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { SubscriptionPayment } from './subscription.payment.entity';
import { Sequelize } from 'sequelize';

@Table({ timestamps: false })
export class Subscription extends Model {
	@Column({
		type: DataType.UUID,
		defaultValue: Sequelize.literal('gen_random_uuid()'),
		primaryKey: true,
		allowNull: false,
	})
	id: string;

	@Column({
		type: DataType.UUID,
		unique: true,
		allowNull: false,
	})
	userId: string;

	@Column({
		type: DataType.DATE,
		allowNull: true,
		defaultValue: null,
	})
	startAt: Date | null;

	@Column({
		type: DataType.DATE,
		defaultValue: null,
		allowNull: true,
	})
	expiredAt: Date | null;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: true,
		allowNull: false,
	})
	autoRenewal: boolean;

	@HasMany(() => SubscriptionPayment)
	payments: SubscriptionPayment[];
}
