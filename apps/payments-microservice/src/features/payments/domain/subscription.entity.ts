import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Sequelize } from 'sequelize';

@Table({ timestamps: true })
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
		defaultValue: null,
		allowNull: true,
	})
	updatedAt: Date | null;
}
