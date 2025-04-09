import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CoreConfig } from './config/configuration';
import { AppModule } from './app.module';
import { configApp } from './config/apply-app-settings/set.app';

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(AppModule);
	const coreConfig = appContext.get<CoreConfig>(CoreConfig);

	const httpApp = await NestFactory.create(AppModule);
	configApp(httpApp);
	await httpApp.listen(coreConfig.httpPort);

	const tcpApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.TCP,
		options: {
			host: coreConfig.tcpHost,
			port: coreConfig.tcpPort,
		},
	});
	await tcpApp.listen();

	const rabbitApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.RMQ,
		options: {
			urls: ['amqp://localhost:5672'],
			queue: 'payments_queue',
			queueOptions: {
				durable: false,
			},
		},
	});
	await rabbitApp.listen();

	console.log(`Payments Microservice TCP is listening on port ${coreConfig.tcpPort}`);
	console.log(`Payments Microservice HTTP is listening on port ${coreConfig.httpPort}`);
	console.log(
		`Payments Microservice RABBIT is listening on port ${coreConfig.rabbitPort}`,
	);
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
