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
		type: DataType.ENUM,
		values: ['1', '3', '10', '100'],
		allowNull: false,
	})
	price: string;

	@Column({
		type: DataType.ENUM,
		values: ['DAY', 'WEEK', 'MONTH', 'YEAR'],
		allowNull: false,
	})
	paymentPeriod: string;

	@Column({
		type: DataType.ENUM,
		values: ['STRIPE', 'PAYPAL'],
		allowNull: false,
	})
	paymentService: string;

	@Column({
		type: DataType.ENUM,
		values: ['SUCCEEDED', 'PENDING', 'FAILURE'],
		allowNull: false,
	})
	status: string;
}
