import { Module } from '@nestjs/common';
import { configModule } from './config/config-dynamic-module';
import { MicroservicePaymentsModule } from './features/payments/payments.module';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from '../database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subscription } from './features/payments/domain/subscription.entity';

@Module({
	imports: [
		CoreModule,
		configModule,
		MicroservicePaymentsModule,
		DatabaseModule,
		SequelizeModule.forFeature([Subscription]),
	],
})
export class AppModule {}
