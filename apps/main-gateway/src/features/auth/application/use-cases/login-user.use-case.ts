import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { Inject } from '@nestjs/common';
import { add } from 'date-fns';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { SessionRepository } from '../../../session/infrastructure/session.repository';
import { NotFoundDomainException } from 'apps/main-gateway/src/core/exceptions/domain-exceptions';
import { AuthConfig } from '../../auth.config';
import { SessionCreateModel } from '../../../session/api/models/input/create.session.model';
import { SessionEntity } from '../../../session/domain/session.entity';

export class UserLoginCommand {
  constructor(public userId: string,
    public deviceName: string,
    public ip: string
  ) { }
}

@CommandHandler(UserLoginCommand)
export class UserLoginUseCase implements ICommandHandler<UserLoginCommand> {
  constructor(
    @Inject(SessionRepository.name) private readonly sessionRepository: SessionRepository,
    @Inject(AuthService.name) protected authService: AuthService,
    @Inject(UserRepository.name) private readonly userRepository: UserRepository,
    @Inject(AuthConfig.name) private readonly authConfig: AuthConfig
  ) { }

  async execute(command: UserLoginCommand): Promise<{ accessToken: string, refreshToken: string } | false> {
    const user = await this.userRepository.getByUnique({ id: command.userId });
    if (!user) throw NotFoundDomainException.create('User not found');

    const sessionDuration = parseInt(this.authConfig.refreshExpiresIn.slice(0, -1));

    const sessionModel: SessionCreateModel = {
      userId: command.userId,
      ip: command.ip ?? 'Unknown',
      deviceName: command.deviceName ?? 'Unknown',
      expirationDate: add(new Date(), {
        days: sessionDuration
      })
    }
    const session = new SessionEntity(sessionModel);
    const newSession = await this.sessionRepository.create(session);
      
    const dateString = newSession.updatedAt.toISOString()
    const tokens = await this.authService.generateTokens(command.userId, newSession.id, dateString);

    return tokens;
  }
}