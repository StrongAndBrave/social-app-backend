import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { Inject } from '@nestjs/common';
import { SessionRepository } from '../../../session/infrastructure/session.repository';
import { AuthConfig } from '../../auth.config';
import { add } from 'date-fns';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';


export class RefreshTokensCommand {
  constructor(public deviceId: string
  ) { }
}

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensUseCase implements ICommandHandler<RefreshTokensCommand> {
  constructor(
    @Inject(SessionRepository.name) private readonly sessionRepository: SessionRepository,
    @Inject(AuthService.name) protected authService: AuthService,
    @Inject(AuthConfig.name) private readonly authConfig: AuthConfig
  ) { }

  async execute(command: RefreshTokensCommand): Promise<{ accessToken: string, refreshToken: string } | false> {

    const session = await this.sessionRepository.getByUnique({ id: command.deviceId });
    if (!session) throw UnauthorizedDomainException.create('Session not found or expired');

    const sessionDuration = parseInt(this.authConfig.refreshExpiresIn.slice(0, -1));
    session.expirationDate = add(new Date(), { days: sessionDuration });

    await this.sessionRepository.update({ where: { id: session.id }, data: { expirationDate: session.expirationDate } })

    const issuedAtString = session.updatedAt.toISOString()
    const userId = session.userId.toString()
    const sessionId = session.id.toString()
    const tokens = await this.authService.generateTokens(userId, sessionId, issuedAtString);
    
    return tokens
  }
}