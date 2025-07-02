import { INestApplication } from '@nestjs/common';
import * as express from 'express';

export const GLOBAL_PREFIX = 'api/v1';

export function configApp(app: INestApplication) {
	app.setGlobalPrefix(GLOBAL_PREFIX);
	app.use('/api/v1/payments/stripe-webhook', express.raw({ type: 'application/json' }));
	app.use(
		'/api/v1/payments/subscription-auto-renewal',
		express.raw({ type: 'application/json' }),
	);
}
