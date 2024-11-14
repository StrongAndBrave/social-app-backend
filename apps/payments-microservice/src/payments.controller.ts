import { Body, Controller, Get, Post } from "@nestjs/common";
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getHello(): string {
    return this.paymentsService.getHello();
  }

  @Post('notify-payment')
  notifyPayment(@Body() paymentInfo: any) {
    this.paymentsService.notifyPaymentSuccess(paymentInfo);
    return { message: 'Payment notification sent' };
  }
}
