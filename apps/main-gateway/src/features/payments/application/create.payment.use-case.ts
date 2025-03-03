import { PaymentCreateModel, PaymentInputModel } from '../api/models/input/payment.input';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentsClientService } from '../../../core/tcp-connections/payments-microservice-connection/payment-client-service';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../user/infrastructure/user.repository';
import { PaymentEntity } from '../domain/payment.entity';

export class PaymentCreateCommand {
	constructor(
		public userId: string,
		public paymentData: PaymentInputModel,
	) {}
}

@CommandHandler(PaymentCreateCommand)
export class PaymentCreateUseCase implements ICommandHandler<PaymentCreateCommand> {
	constructor(
		private readonly paymentsClientService: PaymentsClientService,
		@Inject(UserRepository.name) private readonly userRepository: UserRepository,
	) {}

	async execute(command: PaymentCreateCommand) {
		const user = await this.userRepository.findOrNotFoundFail(command.userId);

		const paymentCreateData: PaymentCreateModel = {
			...command.paymentData,
			userId: user.id,
		};

		const newPayment = PaymentEntity.create(paymentCreateData);

		await this.paymentsClientService.sendPaymentInfoToMicroservice(newPayment);
	}
}
