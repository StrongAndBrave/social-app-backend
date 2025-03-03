import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
	constructor() {}

	@MessagePattern('Payments Controller')
	async someDo() {}
}
