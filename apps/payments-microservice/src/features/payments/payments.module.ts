import { Module } from '@nestjs/common';
import { PaymentsController } from './api/payments.controller';
import { CoreConfig } from '../../config/configuration';
import { ConfigModule } from '@nestjs/config';
import { configModule } from '../../config/config-dynamic-module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), configModule],
	controllers: [PaymentsController],
	providers: [CoreConfig],
})
export class PaymentsModule {}
