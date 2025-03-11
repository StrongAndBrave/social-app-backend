import {
	IsLowercase,
	IsNotEmpty,
	IsNumber,
	IsString,
	IsUppercase,
} from 'class-validator';

export class PaymentInputModel {
	@IsNotEmpty()
	@IsLowercase()
	@IsString()
	paymentPeriod: 'day' | 'week' | 'month' | 'year';

	@IsNotEmpty()
	@IsUppercase()
	@IsString()
	paymentService: 'STRIPE' | 'PAYPAL';

	@IsNotEmpty()
	@IsNumber()
	amount: number;
}

export interface PaymentCreateModel extends PaymentInputModel {
	userId: string;
}
