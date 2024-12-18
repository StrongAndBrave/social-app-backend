import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { SessionRepository } from "../../infrastructure/session.repository";
import { NotFoundDomainException, UnauthorizedDomainException } from "apps/main-gateway/src/core/exceptions/domain-exceptions";

export class DeviceDeleteCommand {
  constructor(public userId: string,
    public deviceId: string
  ) { }
}

@CommandHandler(DeviceDeleteCommand)
export class DeviceDeleteUseCase implements ICommandHandler<DeviceDeleteCommand> {
  constructor(
    @Inject(SessionRepository.name) private readonly sessionRepository: SessionRepository
  ) { }

  async execute(command: DeviceDeleteCommand): Promise<boolean> {
    const session = await this.sessionRepository.getByUnique({ id: command.deviceId })
    if (!session) throw NotFoundDomainException.create('Session not found');

    if (session.userId !== command.userId) throw UnauthorizedDomainException.create('Unauthorized');

    await this.sessionRepository.softDeleteById(command.deviceId)
    return true
  }
}