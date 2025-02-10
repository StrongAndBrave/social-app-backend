import { Global, Module } from '@nestjs/common';
import { CoreConfig } from '../config/env/configuration';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from '../../../../libs/prisma/prisma.service';    //напиши относительный путь
import { FilesClientService } from './utils/files-microservice-connection/client-service';


@Global()
@Module({
  imports: [CqrsModule],
  providers: [ PrismaService,
    {
      provide: CoreConfig.name,
      useClass: CoreConfig,
    },
    {
      provide: FilesClientService.name,
      useClass: FilesClientService,
    },
  ],
  exports: [CoreConfig.name, PrismaService, CqrsModule, FilesClientService.name],
})
export class CoreModule { }