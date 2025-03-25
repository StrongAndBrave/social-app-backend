import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/prisma/prisma.service';
import { OrderEntity } from '../domain/order.entity';

@Injectable()
export class PaymentsRepository {
	constructor(private readonly prisma: PrismaService) {}

	/*async createOrder(data: OrderEntity) {
		return this.prisma.order.create({ data });*/
	//}
}
