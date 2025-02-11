import { ConfigModule } from '@nestjs/config';

// you must import this const in the head of your app.module.ts
export const configModule = ConfigModule.forRoot({
	envFilePath: [
		`apps/payments-microservice/.env.${process.env.NODE_ENV}.local`,
		`apps/payments-microservice/.env.${process.env.NODE_ENV}`,
		'apps/payments-microservice/.env.production',
	],
	isGlobal: true,
});
