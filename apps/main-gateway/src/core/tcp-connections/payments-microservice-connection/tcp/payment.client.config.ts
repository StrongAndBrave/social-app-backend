import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from '../../../../config/config-validation.utility';

@Injectable()
export class PaymentTCPClientConfig {
	@IsNotEmpty()
	paymentsServiceHost: string = this.configService.get('PAYMENTS_SERVICE_HOST');

	@IsNumber(
		{},
		{
			message: 'Set Env variable PAYMENTS_SERVICE_PORT, example: 3456',
		},
	)
	paymentsServicePort: number = Number(this.configService.get('PAYMENTS_SERVICE_PORT'));

	constructor(private configService: ConfigService<any, true>) {
		configValidationUtility.validateConfig(this);
	}
}
