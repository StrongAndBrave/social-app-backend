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
import { PaymentCreateCommand } from '../application/create.payment.use-case';

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
		const paymentInfo = await this.commandBus.execute(
			new PaymentCreateCommand(userId, inputBody),
		);
		if (!paymentInfo) {
			throw new InternalServerErrorException();
		}
		return paymentInfo;
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
