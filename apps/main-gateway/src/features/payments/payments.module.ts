import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaymentsTCPClientService } from '../../core/tcp-connections/payments-microservice-connection/tcp/payment.client.service';
import { UserRepository } from '../user/infrastructure/user.repository';
import { PaymentsController } from './api/payments.controller';
import { SendPaymentInfoUseCase } from './application/send.payment.use-case';
import { ThrottlerModule } from '@nestjs/throttler';
import { PaymentsTCPClientModule } from '../../core/tcp-connections/payments-microservice-connection/tcp/payment.client.module';
import { PaymentsListenerController } from './api/payments.listener.controller';
import { ProfileRepository } from '../profile/infrastructure/profile.repository';
import { ProfileModule } from '../profile/profile.module';
import { SendPaymentAutoRenewalInfoUseCase } from './application/send.auto-renewal.info.use-case';

@Module({
	imports: [
		JwtModule,
		ThrottlerModule.forRoot([
			{
				ttl: 10000,
				limit: 5,
			},
		]),
		PaymentsTCPClientModule,
		ProfileModule,
	],
	providers: [
		{
			provide: UserRepository.name,
			useClass: UserRepository,
		},
		{
			provide: ProfileRepository.name,
			useClass: ProfileRepository,
		},
		PaymentsTCPClientService,
		SendPaymentInfoUseCase,
		SendPaymentAutoRenewalInfoUseCase,
	],
	controllers: [PaymentsController, PaymentsListenerController],
})
export class PaymentsModule {}
