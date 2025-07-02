import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Model,
	Table,
} from 'sequelize-typescript';
import { Sequelize } from 'sequelize';
import { Subscription } from './subscription.entity';

@Table({ timestamps: false })
export class SubscriptionPayment extends Model {
	@Column({
		type: DataType.UUID,
		defaultValue: Sequelize.literal('gen_random_uuid()'),
		primaryKey: true,
		allowNull: false,
	})
	id: string;

	@ForeignKey(() => Subscription)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	userId: string;

	@Column({
		allowNull: false,
	})
	sessionId: string;

	@Column({
		defaultValue: null,
		allowNull: true,
	})
	subscriptionId: string;

	@Column({
		allowNull: false,
	})
	username: string;

	@Column({
		type: DataType.SMALLINT,
		allowNull: false,
	})
	price: number;

	@Column({
		type: DataType.ENUM('day', 'week', 'month', 'year'),
		allowNull: false,
	})
	paymentPeriod: 'day' | 'week' | 'month' | 'year';

	@Column({
		type: DataType.ENUM('stripe', 'paypal'),
		allowNull: false,
	})
	paymentService: 'stripe' | 'paypal';

	@Column({
		type: DataType.ENUM('succeeded', 'pending', 'failure'),
		defaultValue: 'pending',
		allowNull: false,
	})
	status: string;

	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	clientReferenceId: string;

	@Column({
		type: DataType.DATE,
		defaultValue: Sequelize.literal('now()'),
		allowNull: false,
	})
	createdAt: string;

	@Column({
		type: DataType.DATE,
		defaultValue: null,
		allowNull: true,
	})
	updatedAt: string | null;

	@BelongsTo(() => Subscription, { foreignKey: 'userId', targetKey: 'userId' })
	subscription: Subscription;
}
