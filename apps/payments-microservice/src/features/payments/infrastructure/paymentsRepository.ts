import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/prisma/prisma.service';

@Injectable()
export class PaymentsRepository {
	constructor(private readonly prismaService: PrismaService) {}
}
