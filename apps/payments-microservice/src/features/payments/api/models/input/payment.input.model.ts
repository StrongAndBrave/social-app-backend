export class PaymentInputModel {
	userId: string;
	username: string;
	paymentPeriod: 'day' | 'week' | 'month' | 'year';
	paymentService: 'stripe' | 'paypal';
}

export class AutoRenewalInputModel {
	userId: string;
	autoRenewal: boolean;
}

export interface SubscriptionPaymentCreateModel extends PaymentInputModel {
	sessionId: string;
	price: number;
	clientReferenceId: string;
}

export interface SubscriptionCreateModel {
	userId: string;
	startAt: Date | null;
	expiredAt: Date | null;
}
