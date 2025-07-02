import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { configModule } from './config/config-dynamic-module';
import { MicroservicePaymentsModule } from './features/payments/payments.module';
import { DatabaseModule } from './database/database.module';
import { SchedulerModule } from './core/scheduler/scheduler.module';
import { RmqModule } from './core/rmq-connections/rmq.module';

@Module({
	imports: [
		CoreModule,
		configModule,
		SchedulerModule,
		MicroservicePaymentsModule,
		DatabaseModule,
		RmqModule,
	],
})
export class AppModule {}
