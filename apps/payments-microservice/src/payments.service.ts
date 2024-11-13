import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject('PAYMENTS_SERVICE') private readonly client: ClientProxy, // Подключаем RabbitMQ клиент
  ) {}

  getHello(): string {
    return 'Hello from Payments Service!';
  }

  notifyPaymentSuccess(paymentInfo: any) {
    // Публикуем событие успешного платежа
    this.client.emit('payment_successful', paymentInfo);
  }
}
