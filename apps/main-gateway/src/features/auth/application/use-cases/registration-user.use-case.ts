import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { UserInputModel } from '../../../user/api/models/input/user.input';
import { UserCreateCommand } from '../../../user/application/use-cases/user.create.use-case';
import { MailService } from '../../../../core/adapters/mailer/mail.service';

export class UserRegistrationCommand {
  constructor(public userData: UserInputModel) { }
}

@CommandHandler(UserRegistrationCommand)
export class UserRegistrationUseCase implements ICommandHandler<UserRegistrationCommand> {
  constructor(
    protected mailService: MailService,
    private readonly commandBus: CommandBus,
    @Inject(UserRepository.name) private readonly userRepository: UserRepository
  ) { }

  async execute(command: UserRegistrationCommand): Promise<boolean> {
    const token = uuidv4();
    const expirationDate = add(new Date(), {
      hours: 1,
    })

    const newUserId: string = await this.commandBus.execute(new UserCreateCommand(command.userData))
    if (!newUserId) return false;

    const user = await this.userRepository.getByUnique({ id: newUserId })
    if (!user) return false

    await this.userRepository.update({ where: { id: newUserId }, data: { confirmationCode: token, codeExpirationDate: expirationDate } })

    await this.mailService.sendUserConfirmation(command.userData.email, command.userData.username, token)

    return true;

  }
}