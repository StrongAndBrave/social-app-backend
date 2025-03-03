import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaymentConfig } from './payments.config';
import { PaymentsClientService } from '../../core/tcp-connections/payments-microservice-connection/payment-client-service';
import { UserRepository } from '../user/infrastructure/user.repository';
import { PaymentController } from './api/payments.controller';

@Module({
	imports: [JwtModule],
	providers: [
		{
			provide: UserRepository.name,
			useClass: UserRepository,
		},
		{
			provide: PaymentConfig.name,
			useClass: PaymentConfig,
		},
		PaymentsClientService,
	],
	controllers: [PaymentController],
})
export class PaymentsModule {}
