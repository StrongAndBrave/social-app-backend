import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PaymentsModule } from './payments/payments.module';

async function bootstrap() {
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
}

bootstrap();
