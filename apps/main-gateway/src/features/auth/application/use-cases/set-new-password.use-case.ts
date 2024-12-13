import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { UserRepository } from "../../../user/infrastructure/user.repository";
import { RecoveryPasswordDataRepository } from "../../infrastructure/recovery.password.data.repository";
import { BadRequestDomainException, NotFoundDomainException } from "apps/main-gateway/src/core/exceptions/domain-exceptions";
import { AuthService } from "../auth.service";


export class SetNewPasswordCommand {
  constructor(public password: string,
    public recoveryCode: string
  ) { }
}

@CommandHandler(SetNewPasswordCommand)
export class SetNewPasswordUseCase implements ICommandHandler<SetNewPasswordCommand> {
  constructor(
    @Inject(UserRepository.name) private readonly userRepository: UserRepository,
    @Inject(RecoveryPasswordDataRepository.name) private readonly passwordRecoveryDataRepository: RecoveryPasswordDataRepository,
    @Inject(AuthService.name) private readonly authService: AuthService
  ) { }

  async execute(command: SetNewPasswordCommand): Promise<boolean> {
    const recoveryData = await this.passwordRecoveryDataRepository.getByUnique({recoveryCode: command.recoveryCode})
    if (!recoveryData) throw BadRequestDomainException.create('Recovery code is incorrect, expired or already been applied')

    if ((recoveryData.expirationDate < new Date()) || recoveryData.isConfirmed === true) throw BadRequestDomainException.create('Recovery code is incorrect, expired or already been applied')

    const user = await this.userRepository.getByUnique({id: recoveryData.userId})
    const hash = await this.authService.generateHash(command.password)

    await this.userRepository.update({where: {id: user!.id}, data: {passwordHash: hash}})
    await this.passwordRecoveryDataRepository.update({where: {id: recoveryData.id}, data: {isConfirmed: true}})
    return true
  }
}