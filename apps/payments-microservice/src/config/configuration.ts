import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Injectable()
export class CoreConfig {
	@IsNumber(
		{},
		{
			message: 'Set Env variable PORT, example: 3000',
		},
	)
	httpPort: number = this.configService.get('PORT');

	@IsNumber(
		{},
		{
			message: 'Set Env variable PORT, example: 3000',
		},
	)
	tcpPort: number = this.configService.get('PORT');

	@IsNotEmpty()
	tcpHost: string = this.configService.get('HOST');

	constructor(private configService: ConfigService<any, true>) {}
}
