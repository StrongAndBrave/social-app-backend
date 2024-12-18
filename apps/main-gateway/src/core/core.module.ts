import { Global, Module } from '@nestjs/common';
import { CoreConfig } from '../config/env/configuration';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from 'libs/prisma/prisma.service';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [CoreConfig, PrismaService],
  exports: [CoreConfig, PrismaService, CqrsModule],
})
export class CoreModule {}