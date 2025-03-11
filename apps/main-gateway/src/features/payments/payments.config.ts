import { Injectable } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from '../../config/config-validation.utility';

@Injectable()
export class PaymentConfig {
	@IsNotEmpty()
	paymentsServiceHost: string = this.configService.get('PAYMENTS_SERVICE_HOST');

	@IsNotEmpty()
	paymentsServicePort: number = this.configService.get('PAYMENTS_SERVICE_PORT');

	@IsNotEmpty()
	daySubscription: string = this.configService.get('DAY_SUBSCRIPTION');

	@IsNotEmpty()
	weekSubscription: string = this.configService.get('WEEK_SUBSCRIPTION');

	@IsNotEmpty()
	monthSubscription: string = this.configService.get('MONTH_SUBSCRIPTION');

	@IsNotEmpty()
	yearSubscription: string = this.configService.get('YEAR_SUBSCRIPTION');

	constructor(private configService: ConfigService<any, true>) {
		configValidationUtility.validateConfig(this);
	}
}
