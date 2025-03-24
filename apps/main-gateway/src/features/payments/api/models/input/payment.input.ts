import { IsLowercase, IsNotEmpty, IsString, IsUppercase } from 'class-validator';

export class PaymentInputModel {
	@IsNotEmpty()
	@IsLowercase()
	@IsString()
	paymentPeriod: 'day' | 'week' | 'month' | 'year';

	@IsNotEmpty()
	@IsUppercase()
	@IsString()
	paymentService: 'STRIPE' | 'PAYPAL';
}
