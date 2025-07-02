import { Controller, Inject } from '@nestjs/common';
import { ProfileRepository } from '../../profile/infrastructure/profile.repository';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AccountUpgradeModel } from './models/input/account.upgrade.model';

@Controller()
export class PaymentsListenerController {
	constructor(
		@Inject(ProfileRepository.name) private readonly profileRepository: ProfileRepository,
	) {}

	@EventPattern({ cmd: 'upgradeAccountType' })
	async upgradeType(
		@Payload() accountUpgradeData: AccountUpgradeModel,
		@Ctx() context: RmqContext,
	) {
		console.log('data: ', accountUpgradeData);

		const channel = context.getChannelRef();
		const message = context.getMessage();

		try {
			await this.profileRepository.update({
				where: { userId: accountUpgradeData.userId },
				data: {
					accountType: accountUpgradeData.accountType,
					subscriptionPeriod: accountUpgradeData.subscriptionPeriod,
				},
			});
			channel.ack(message);
		} catch (error) {
			console.error(error);
		}
	}
}
