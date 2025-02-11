import { Module } from '@nestjs/common';
import { EmailConfig } from './mail.config';

@Module({
	imports: [],
	providers: [EmailConfig],
	exports: [EmailConfig],
})
export class EmailConfigModule {}
