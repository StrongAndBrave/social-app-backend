import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Controller('payments')
export class PaymentsController {
	constructor(private commandBus: CommandBus) {}
}
