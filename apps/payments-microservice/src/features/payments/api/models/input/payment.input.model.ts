export class PaymentInputModel {
	userId: string;
	username: string;
	paymentPeriod: 'day' | 'week' | 'month' | 'year';
	paymentService: 'STRIPE' | 'PAYPAL';
}

export interface OrderCreateModel extends Omit<PaymentInputModel, 'username'> {
	productName: string;
	price: number;
}
