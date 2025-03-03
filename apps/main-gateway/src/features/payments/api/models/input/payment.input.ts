import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export enum PaymentPeriod {
	DAY = 0,
	WEEKLY = 1,
	MONTHLY = 2,
}

export enum PaymentService {
	STRIPE = 0,
	PAYPAL = 1,
}

export class PaymentInputModel {
	@IsNotEmpty()
	@IsEnum(PaymentPeriod)
	paymentPeriod: PaymentPeriod;

	@IsNotEmpty()
	@IsEnum(PaymentService)
	paymentService: PaymentService;

	@IsNotEmpty()
	@IsNumber()
	amount: number;
}

export interface PaymentCreateModel extends PaymentInputModel {
	userId: string;
}
