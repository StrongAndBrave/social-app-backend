import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class MicroservicePaymentsModule {}
