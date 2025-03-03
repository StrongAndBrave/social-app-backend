import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PaymentInputModel } from './models/input/payment.input';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUserId } from '../../../core/decorators/transform/current-user-id.param.decorator';

@Controller('subscriptions')
export class PaymentController {
	constructor(private commandBus: CommandBus) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@HttpCode(201)
	async buySubscription(
		@Body() inputBody: PaymentInputModel,
		@CurrentUserId() userId: string,
	) {}
}
