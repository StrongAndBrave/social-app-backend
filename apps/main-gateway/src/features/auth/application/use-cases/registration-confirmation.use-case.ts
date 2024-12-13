import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { UserRepository } from "../../../user/infrastructure/user.repository";
import { NotFoundDomainException } from "apps/main-gateway/src/core/exceptions/domain-exceptions";


export class RegistrationConfirmationCommand {
  constructor(public code: string) { }
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase implements ICommandHandler<RegistrationConfirmationCommand> {
  constructor(
    @Inject(UserRepository.name) private readonly userRepository: UserRepository
  ) { }

  async execute(command: RegistrationConfirmationCommand) {
    // приходит код, проверяю, что он есть в базе, не протух и isConfirmed это false, вношу подтверждение в isConfirmed
    const user = await this.userRepository.getByUnique({ confirmationCode: command.code });
    if (!user) throw NotFoundDomainException.create('User not found');

    await this.userRepository.update({ where: { id: user.id }, data: { isConfirmed: true } });

    return true
  }
}