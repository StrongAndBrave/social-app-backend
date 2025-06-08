import { AutoRenewalInputModel } from '../api/models/input/payment.input';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentsTCPClientService } from '../../../core/tcp-connections/payments-microservice-connection/tcp/payment.client.service';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../user/infrastructure/user.repository';

export class SendAutoRenewalInfoCommand {
	constructor(
		public userId: string,
		public autoRenewalInfo: AutoRenewalInputModel,
	) {}
}

@CommandHandler(SendAutoRenewalInfoCommand)
export class SendPaymentAutoRenewalInfoUseCase
	implements ICommandHandler<SendAutoRenewalInfoCommand>
{
	constructor(
		private readonly paymentsTCPClientService: PaymentsTCPClientService,
		@Inject(UserRepository.name) private readonly userRepository: UserRepository,
	) {}

	async execute(command: SendAutoRenewalInfoCommand) {
		const user = await this.userRepository.findOrNotFoundFail(command.userId);

		const sendData =
			await this.paymentsTCPClientService.sendAutoRenewalInfoToMicroservice({
				userId: user.id,
				autoRenewal: command.autoRenewalInfo.autoRenewal,
			});

		return sendData ?? null;
	}
}
