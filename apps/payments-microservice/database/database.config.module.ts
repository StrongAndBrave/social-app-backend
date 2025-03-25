import { Module } from '@nestjs/common';
import { DatabaseConfig } from './database.config';

@Module({
	imports: [],
	providers: [DatabaseConfig],
	exports: [DatabaseConfig],
})
export class DatabaseConfigModule {}
