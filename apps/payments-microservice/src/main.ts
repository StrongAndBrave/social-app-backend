import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { CoreConfig } from './config/configuration';
import { AppModule } from './app.module';
import { configApp } from './config/apply-app-settings/set.app';

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(AppModule);
	const coreConfig = appContext.get<CoreConfig>(CoreConfig);

	const app = await NestFactory.create(AppModule);
	configApp(app);
	await app.listen(coreConfig.httpPort);
	console.log(`Payments Microservice HTTP is listening on port:${coreConfig.httpPort}`);

	const microservice = await NestFactory.createMicroservice<MicroserviceOptions>({
		options: {
			host: coreConfig.tcpHost,
			port: coreConfig.tcpPort,
		},
	});

	await microservice.listen();
	console.log(`Payments Microservice is listening on port: ${coreConfig.tcpPort}`);
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
