import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { SessionRepository } from "../../infrastructure/session.repository";

export class DevicesDeleteCommand {
  constructor(
    public deviceId: string,
    public userId: string
  ) { }
}

@CommandHandler(DevicesDeleteCommand)
export class DevicesDeleteUseCase implements ICommandHandler<DevicesDeleteCommand> {
  constructor(
    @Inject(SessionRepository.name) private readonly sessionRepository: SessionRepository
  ) { }

  async execute(command: DevicesDeleteCommand) {
    await this.sessionRepository.softDeleteSessionsExcludeId(command.deviceId, command.userId)

    return true
  }
}