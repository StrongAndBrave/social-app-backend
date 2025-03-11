import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Injectable()
export class CoreConfig {
	@IsNumber(
		{},
		{
			message: 'Set Env variable PORT, example: 3000',
		},
	)
	port: number = this.configService.get('PORT');

	@IsNotEmpty()
	host: string = this.configService.get('HOST');

	@IsNotEmpty()
	stripeSecretKey: string = this.configService.get('STRIPE_SECRET_KEY');

	@IsNotEmpty()
	stripePublishKey: string = this.configService.get('STRIPE_PUBLISH_KEY');

	@IsNotEmpty()
	successPaymentResUrl: string = this.configService.get('SUCCESS_PAYMENT_RES_URL');

	@IsNotEmpty()
	failurePaymentResUrl: string = this.configService.get('FAILURE_PAYMENT_RES_URL');

	constructor(private configService: ConfigService<any, true>) {}
}
