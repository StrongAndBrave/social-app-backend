import {
	Controller,
	Delete,
	Get,
	HttpCode,
	Inject,
	NotFoundException,
	Param,
	UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SessionQueryRepository } from '../infrastructure/session.query.repository';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUserId } from '../../../core/decorators/transform/current-user-id.param.decorator';
import { DeviceDeleteCommand } from '../application/use-cases/delete.device.use-case';
import { DevicesDeleteCommand } from '../application/use-cases/delete.devices.use-case';
import { JwtCookieGuard } from '../../../core/guards/jwt-cookie.guard';
import { RefreshCookieInputModel } from './models/input/refresh.cookie.model';
import { CurrentSession } from '../../../core/decorators/transform/session.data.cookie.decorator';

@Controller('sessions')
export class SessionController {
	constructor(
		private commandBus: CommandBus,
		@Inject(SessionQueryRepository.name)
		private readonly sessionQueryRepository: SessionQueryRepository,
	) {}

	@UseGuards(JwtCookieGuard)
	@HttpCode(200)
	@Get()
	async findAllSessions(
		@CurrentUserId() userId: string,
		@CurrentSession() cookie: RefreshCookieInputModel,
	) {
		return this.sessionQueryRepository.findAllActiveSessions(userId, cookie.deviceId);
	}

	@UseGuards(JwtCookieGuard)
	@HttpCode(204)
	@Delete('terminate-all')
	async terminateAllSessionsExcludeCurrent(
		@CurrentUserId() userId: string,
		@CurrentUserId() cookie: RefreshCookieInputModel,
	) {
		await this.commandBus.execute(new DevicesDeleteCommand(userId, cookie.deviceId));
	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(204)
	@Delete(':deviceId')
	async terminateSessionByDeviceId(
		@Param('deviceId') deviceId: string,
		@CurrentUserId() userId: string,
	) {
		if (!deviceId) {
			throw new NotFoundException();
		}
		await this.commandBus.execute(new DeviceDeleteCommand(userId, deviceId));
	}
}
