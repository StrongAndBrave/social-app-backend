import {
	Body,
	Controller,
	Get,
	HttpCode,
	InternalServerErrorException,
	Post,
	UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AutoRenewalInputModel, PaymentInputModel } from './models/input/payment.input';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUserId } from '../../../core/decorators/transform/current-user-id.param.decorator';
import { SendPaymentInfoCommand } from '../application/send.payment.use-case';
import { SendAutoRenewalInfoCommand } from '../application/send.auto-renewal.info.use-case';
import { PaymentsTCPClientService } from '../../../core/tcp-connections/payments-microservice-connection/tcp/payment.client.service';

@Controller('subscriptions')
export class PaymentsController {
	constructor(
		private commandBus: CommandBus,
		private readonly paymentsTCPClientService: PaymentsTCPClientService,
	) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@HttpCode(201)
	async buySubscription(
		@Body() inputBody: PaymentInputModel,
		@CurrentUserId() userId: string,
	) {
		const newPaymentInfo = await this.commandBus.execute(
			new SendPaymentInfoCommand(userId, inputBody),
		);
		if (!newPaymentInfo) {
			throw new InternalServerErrorException();
		}
		return newPaymentInfo;
	}

	@Get('success')
	success(): string {
		return 'Payment was successful!';
	}

	@Get('failure')
	failure(): string {
		return 'Transaction failed, please try again';
	}

	@Post('auto-renewal')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	async updateAutoRenewal(
		@CurrentUserId() userId: string,
		@Body() dto: AutoRenewalInputModel,
	) {
		const newAutoRenewalInfo = await this.commandBus.execute(
			new SendAutoRenewalInfoCommand(userId, dto),
		);
		if (!newAutoRenewalInfo) {
			throw new InternalServerErrorException();
		}
	}

	@Get('my-payments')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	async getPayments(@CurrentUserId() userId: string) {
		return this.paymentsTCPClientService.getPayments(userId);
	}
}
