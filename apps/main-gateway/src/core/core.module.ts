import { Global, Module } from '@nestjs/common';
import { CoreConfig } from '../config/env/configuration';
import { CqrsModule } from '@nestjs/cqrs';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [CoreConfig],
  exports: [CoreConfig],
})
export class CoreModule {}