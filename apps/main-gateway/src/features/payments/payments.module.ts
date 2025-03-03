import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaymentsConfig } from './payments.config';
import { PaymentsClientService } from '../../core/tcp-connections/payments-microservice-connection/client-service';
import { PaymentsController } from './api/payments.controller';

@Module({
	imports: [JwtModule],
	providers: [
		{
			provide: PaymentsConfig.name,
			useClass: PaymentsConfig,
		},
		PaymentsClientService,
	],
	controllers: [PaymentsController],
})
export class PaymentsModule {}
