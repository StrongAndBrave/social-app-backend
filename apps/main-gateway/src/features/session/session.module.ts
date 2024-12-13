import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { SessionRepository } from "./infrastructure/session.repository";
import { SessionQueryRepository } from "./infrastructure/session.query.repository";
import { DeviceDeleteUseCase } from "./application/use-cases/delete.device.use-case";
import { DevicesDeleteUseCase } from "./application/use-cases/delete.devices.use-case";

@Module({
  imports: [UserModule,
  ],
  controllers: [],
  providers: [{
    provide: SessionRepository.name,
    useClass: SessionRepository
  },
  {
    provide: SessionQueryRepository.name,
    useClass: SessionQueryRepository
  },
    DeviceDeleteUseCase, DevicesDeleteUseCase
  ],
  exports: [SessionRepository.name, DeviceDeleteUseCase]
})
export class SessionModule {
}