import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RmqService {
	@Inject('MAIN_GATEWAY') private mainGatewayProxyClient: ClientProxy;

	async sendSubscriberData(data: {
		userId: string;
		accountType: 'Business';
		subscriptionPeriod: string;
	}) {
		try {
			console.log(data);
			return await this.mainGatewayProxyClient
				.emit({ cmd: 'upgradeAccountType' }, data)
				.toPromise();
		} catch (error) {
			console.error('something wrong with send data', error);
			return null;
		}
	}
}
