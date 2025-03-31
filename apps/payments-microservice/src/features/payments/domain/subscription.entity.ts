import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Sequelize } from 'sequelize';
import { SubscriptionPayment } from './subscription.payment.entity';

@Table({})
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
		allowNull: false,
	})
	userId: string;

	@Column({
		type: DataType.DATE,
		allowNull: true,
	})
	startAt: Date;

	@Column({
		type: DataType.DATE,
		allowNull: true,
	})
	expiredAt: Date;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: true,
	})
	autoRenewal: boolean;

	@HasMany(() => SubscriptionPayment)
	payments: SubscriptionPayment[];
}
