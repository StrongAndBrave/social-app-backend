import { PaymentCreateModel } from '../api/models/input/payment.input';
import { BaseEntity } from '../../../core/entities/base.entity';

export class PaymentEntity extends BaseEntity {
	userId: string;
	paymentPeriod: 'day' | 'week' | 'month' | 'year';
	paymentService: 'STRIPE' | 'PAYPAL';
	amount: number;

	static create(paymentCreateData: PaymentCreateModel) {
		const payment = new PaymentEntity();
		payment.userId = paymentCreateData.userId;
		payment.paymentPeriod = paymentCreateData.paymentPeriod;
		payment.paymentService = paymentCreateData.paymentService;
		payment.amount = paymentCreateData.amount;
		return payment;
	}
}
