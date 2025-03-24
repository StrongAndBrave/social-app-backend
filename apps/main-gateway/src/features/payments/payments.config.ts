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

	constructor(private configService: ConfigService<any, true>) {
		configValidationUtility.validateConfig(this);
	}
}
