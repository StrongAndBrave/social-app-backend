import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { v4 as uuidv4 } from 'uuid';
import { add } from "date-fns";
import { Inject } from "@nestjs/common";
import { UserRepository } from "../../../user/infrastructure/user.repository";
import { RecoveryPasswordDataRepository } from "../../infrastructure/recovery.password.data.repository";
import { PasswordResetDataEntity } from "../../domain/recovery.password.data.entity";
import { MailService } from "../../../../core/adapters/mailer/mail.service";
import { BadRequestDomainException } from "../../../../core/exceptions/domain-exceptions";


export class PasswordRecoveryCommand {
  constructor(public email: string) { }
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand> {
  constructor(
    @Inject(UserRepository.name) private readonly userRepository: UserRepository,
    @Inject(RecoveryPasswordDataRepository.name) private readonly passwordRecoveryDataRepository: RecoveryPasswordDataRepository,
    @Inject(MailService.name) private readonly mailService: MailService,

  ) { }

  async execute(command: PasswordRecoveryCommand): Promise<boolean> {

    const user = await this.userRepository.getByUsernameOrEmail(command.email);
    if (!user) throw BadRequestDomainException.create('Incorrect input data');

    const token = uuidv4();
    const recoveryPasswordModel = {
      userId: user.id,
      recoveryCode: token,
      expirationDate: add(new Date(), {
        hours: 1,
      })
    }
    const recData = new PasswordResetDataEntity(recoveryPasswordModel)
    await this.passwordRecoveryDataRepository.create(recData)
    await this.mailService.sendPasswordRecovery(user.email, user.username, token)
    return true
  }
}
