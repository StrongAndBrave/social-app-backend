import { configApp } from './config/apply-app-settings/set-app';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CoreConfig } from './config/env/configuration';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const coreConfig = app.get<CoreConfig>(CoreConfig.name);
	configApp(app);

	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [coreConfig.rmqUrl],
			queue: coreConfig.rmqQueue,
			noAck: false,
			queueOptions: {
				durable: true,
			},
		},
	});

	await app.startAllMicroservices();
	await app.listen(coreConfig.port, () => {
		console.log('App starting listen port: ', coreConfig.port);
		console.log('ENV: ', coreConfig.env);
	});
}
bootstrap();
