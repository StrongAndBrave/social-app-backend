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
import { PaymentInputModel } from './models/input/payment.input';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUserId } from '../../../core/decorators/transform/current-user-id.param.decorator';
import { SendPaymentInfoCommand } from '../application/send.payment.use-case';

@Controller('subscriptions')
export class PaymentController {
	constructor(private commandBus: CommandBus) {}

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
}
