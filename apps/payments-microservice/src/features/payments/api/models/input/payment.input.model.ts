export class PaymentInputModel {
	userId: string;
	username: string;
	paymentPeriod: 'day' | 'week' | 'month' | 'year';
	paymentService: 'stripe' | 'paypal';
}

export interface SubscriptionCreateModel extends PaymentInputModel {
	price: number;
	status: 'succeeded' | 'pending' | 'failure';
}
