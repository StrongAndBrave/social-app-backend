import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { PaymentsModule } from './features/payments/payments.module';
import { CoreConfig } from './config/configuration';

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(PaymentsModule);
	const coreConfig = appContext.get<CoreConfig>(CoreConfig);
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(PaymentsModule, {
		options: {
			host: coreConfig.host,
			port: coreConfig.port,
		},
	});

	await app.listen();
	console.log(`Payments Microservice is listening on port ${coreConfig.port}`);
}

/* {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(PaymentsModule, {
		transport: Transport.RMQ,
		options: {
			urls: ['amqp://localhost:5672'],
			queue: 'payments_queue',
			queueOptions: {
				durable: false,
			},
		},
	});

	await app.listen();
	console.log('Payments Microservice is listening on RabbitMQ');
}*/

bootstrap();
