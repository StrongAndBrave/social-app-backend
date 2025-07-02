import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MicroserviceFilesModule } from './object-storage/object.storage.module';
import { CoreConfig } from './config/configuration';

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(MicroserviceFilesModule);
	const coreConfig = appContext.get<CoreConfig>(CoreConfig);
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		MicroserviceFilesModule,
		{
			transport: Transport.TCP,
			options: {
				host: coreConfig.host,
				port: coreConfig.port,
			},
		},
	);
	await app.listen();
	console.log(`Files Microservice is listening on port ${coreConfig.port}`);
}

bootstrap();
