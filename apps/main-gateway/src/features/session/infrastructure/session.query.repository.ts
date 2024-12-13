import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/prisma/prisma.service';
import { Prisma, Session } from '@prisma/client';

@Injectable()
export class SessionQueryRepository {
  constructor(private readonly prisma: PrismaService) { }



}