import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaymentConfig } from './payments.config';
import { PaymentsClientService } from '../../core/tcp-connections/payments-microservice-connection/payment-client-service';
import { UserRepository } from '../user/infrastructure/user.repository';
import { PaymentController } from './api/payments.controller';
import { SendPaymentInfoUseCase } from './application/send.payment.use-case';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
	imports: [
		JwtModule,
		ThrottlerModule.forRoot([
			{
				ttl: 10000,
				limit: 5,
			},
		]),
	],
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
		SendPaymentInfoUseCase,
	],
	controllers: [PaymentController],
})
export class PaymentsModule {}
