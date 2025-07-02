import { ConfigModule } from '@nestjs/config';

// you must import this const in the head of your app.module.ts
export const configModule = ConfigModule.forRoot({
	envFilePath: [
		`apps/main-gateway/.env.${process.env.NODE_ENV}.local`,
		`apps/main-gateway/.env.${process.env.NODE_ENV}`,
		'apps/main-gateway/.env.production',
	],
	isGlobal: true,
});
