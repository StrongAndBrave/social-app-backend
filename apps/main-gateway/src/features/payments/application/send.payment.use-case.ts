import { PaymentInputModel } from '../api/models/input/payment.input';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentsTCPClientService } from '../../../core/tcp-connections/payments-microservice-connection/tcp/payment.client.service';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../user/infrastructure/user.repository';

export class SendPaymentInfoCommand {
	constructor(
		public userId: string,
		public paymentData: PaymentInputModel,
	) {}
}

@CommandHandler(SendPaymentInfoCommand)
export class SendPaymentInfoUseCase implements ICommandHandler<SendPaymentInfoCommand> {
	constructor(
		private readonly paymentsClientService: PaymentsTCPClientService,
		@Inject(UserRepository.name) private readonly userRepository: UserRepository,
	) {}

	async execute(command: SendPaymentInfoCommand) {
		const user = await this.userRepository.findOrNotFoundFail(command.userId);

		const sendData = await this.paymentsClientService.sendPaymentInfoToMicroservice({
			userId: user.id,
			username: user.username,
			paymentPeriod: command.paymentData.paymentPeriod,
			paymentService: command.paymentData.paymentService,
		});

		console.log('ResSendDataInSendPaymentInfoUseCase', sendData);

		return sendData ?? null;
	}
}
