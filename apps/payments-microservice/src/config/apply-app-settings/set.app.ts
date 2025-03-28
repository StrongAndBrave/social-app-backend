import { INestApplication } from '@nestjs/common';

export const GLOBAL_PREFIX = 'api/v1';

export function configApp(app: INestApplication) {
	app.setGlobalPrefix(GLOBAL_PREFIX);
}