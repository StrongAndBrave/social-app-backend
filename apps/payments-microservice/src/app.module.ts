import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { configModule } from './config/config-dynamic-module';
import { MicroservicePaymentsModule } from './features/payments/payments.module';

@Module({
	imports: [CoreModule, configModule, MicroservicePaymentsModule],
})

export class AppModule {}