/*
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { AccountUpgradeModel } from '../../../../features/payments/api/models/input/account.upgrade.model';

@Injectable()
export class PaymentsRMQClientService {
	@Inject('PAYMENTS_RMQ_SERVICE') private paymentsRMQProxyClient: ClientProxy;

	@EventPattern({ cmd: 'upgradeAccountType' })
	async getMsg(data: AccountUpgradeModel) {
		//const msg = this.paymentsRMQProxyClient.connect();
		console.log(data);
	}
}
*/
