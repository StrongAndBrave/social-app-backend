import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class CoreConfig {
	@IsNotEmpty()
	dbHost: string = this.configService.get('DB_HOST');

	@IsNotEmpty()
	dbPort: number = this.configService.get<number>('DB_PORT');

	@IsNotEmpty()
	dbUsername: string = this.configService.get('DB_USERNAME');

	@IsNotEmpty()
	dbPassword: string = this.configService.get('DB_PASSWORD');

	constructor(private configService: ConfigService<any, true>) {}
}
