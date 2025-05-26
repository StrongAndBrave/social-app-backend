import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqConfig } from './rmq.config';
import { RmqConfigModule } from './rmq.config.module';
import { RmqService } from './rmq.service';

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: 'RMQ',
				inject: [RmqConfig],
				imports: [RmqConfigModule],
				useFactory: (rmqConfig: RmqConfig) => ({
					transport: Transport.RMQ,
					options: {
						urls: [rmqConfig.rmqUrl],
						queue: rmqConfig.rmqQueue,
						noAck: false,
						queueOptions: {
							durable: true,
						},
					},
				}),
			},
		]),
	],
	providers: [RmqConfig, RmqService],
	exports: [RmqService, ClientsModule],
})
export class RmqModule {}
