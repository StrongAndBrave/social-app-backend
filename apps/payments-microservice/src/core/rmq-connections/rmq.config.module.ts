import { Module } from '@nestjs/common';
import { RmqConfig } from './rmq.config';

@Module({
	imports: [],
	providers: [RmqConfig],
	exports: [RmqConfig],
})
export class RmqConfigModule {}
