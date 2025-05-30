import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaymentsClientService } from '../../core/tcp-connections/payments-microservice-connection/payment.client.service';
import { UserRepository } from '../user/infrastructure/user.repository';
import { PaymentsController } from './api/payments.controller';
import { SendPaymentInfoUseCase } from './application/send.payment.use-case';
import { ThrottlerModule } from '@nestjs/throttler';
import { PaymentsClientModule } from '../../core/tcp-connections/payments-microservice-connection/payment.client.module';
import { PaymentsListenerController } from './api/payments.listener.controller';
import { ProfileRepository } from '../profile/infrastructure/profile.repository';
import { ProfileModule } from '../profile/profile.module';

@Module({
	imports: [
		JwtModule,
		ThrottlerModule.forRoot([
			{
				ttl: 10000,
				limit: 5,
			},
		]),
		PaymentsClientModule,
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
		PaymentsClientService,
		SendPaymentInfoUseCase,
	],
	controllers: [PaymentsController, PaymentsListenerController],
})
export class PaymentsModule {}
