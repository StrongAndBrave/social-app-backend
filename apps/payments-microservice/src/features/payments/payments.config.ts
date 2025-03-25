import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class PaymentsConfig {
	@IsNotEmpty()
	stripeSecretKey: string = this.configService.get('STRIPE_SECRET_KEY');

	@IsNotEmpty()
	stripePublishKey: string = this.configService.get('STRIPE_PUBLISH_KEY');

	@IsNotEmpty()
	daySubscriptionPrice: string = this.configService.get('DAY_SUBSCRIPTION_PRICE');

	@IsNotEmpty()
	weekSubscriptionPrice: string = this.configService.get('WEEK_SUBSCRIPTION_PRICE');

	@IsNotEmpty()
	monthSubscriptionPrice: string = this.configService.get('MONTH_SUBSCRIPTION_PRICE');

	@IsNotEmpty()
	yearSubscriptionPrice: string = this.configService.get('YEAR_SUBSCRIPTION_PRICE');

	@IsNotEmpty()
	successPaymentResUrl: string = this.configService.get('SUCCESS_PAYMENT_RES_URL');

	@IsNotEmpty()
	failurePaymentResUrl: string = this.configService.get('FAILURE_PAYMENT_RES_URL');

	constructor(private configService: ConfigService<any, true>) {}
}
