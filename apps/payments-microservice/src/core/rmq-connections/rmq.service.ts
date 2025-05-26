import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RmqService {
	@Inject('RMQ') private rmqProxyClient: ClientProxy;

	async sendSubscriberData(data: { userId: string; isSubscribed: boolean }) {
		try {
			console.log(data);
			return await this.rmqProxyClient.send({ cmd: 'send_data' }, data).toPromise();
		} catch (error) {
			console.error('something wrong with send data', error);
			return null;
		}
	}
}
