import { IsLowercase, IsNotEmpty, IsString } from 'class-validator';

export class PaymentInputModel {
	@IsNotEmpty()
	@IsLowercase()
	@IsString()
	paymentPeriod: 'day' | 'week' | 'month' | 'year';

	@IsNotEmpty()
	@IsLowercase()
	@IsString()
	paymentService: 'stripe' | 'paypal';
}
