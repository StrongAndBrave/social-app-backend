import { PaymentInputModel } from '../api/models/input/payment.input';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentsClientService } from '../../../core/tcp-connections/payments-microservice-connection/payment-client-service';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../user/infrastructure/user.repository';
import { PaymentConfig } from '../payments.config';

export class SendPaymentInfoCommand {
	constructor(
		public userId: string,
		public paymentData: PaymentInputModel,
	) {}
}

@CommandHandler(SendPaymentInfoCommand)
export class SendPaymentInfoUseCase implements ICommandHandler<SendPaymentInfoCommand> {
	constructor(
		private readonly paymentsClientService: PaymentsClientService,
		@Inject(PaymentConfig.name) private readonly paymentConfig: PaymentConfig,
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
