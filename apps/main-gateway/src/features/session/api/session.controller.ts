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
import { DeviceDeleteCommand } from '../application/use-cases/delete.device.use-case';
import { DevicesDeleteCommand } from '../application/use-cases/delete.devices.use-case';
import { JwtCookieGuard } from '../../../core/guards/jwt-cookie.guard';
import { RefreshCookieInputModel } from './models/input/refresh.cookie.model';
import { CurrentSession } from '../../../core/decorators/transform/session.data.cookie.decorator';
import { ApiTags } from '@nestjs/swagger';
import { DeleteAllDeviceSessions, DeleteDeviceSessionsByDeviceId, GetDevices } from '../../../core/swagger/sessions.swagger';
import { SessionOutputModel } from './models/output/session.output.model';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionController {
	constructor(
		private commandBus: CommandBus,
		@Inject(SessionQueryRepository.name)
		private readonly sessionQueryRepository: SessionQueryRepository,
	) { }

	@GetDevices()
	@UseGuards(JwtCookieGuard)
	@HttpCode(200)
	@Get()
	async findAllSessions(@CurrentSession() cookie: RefreshCookieInputModel): Promise<SessionOutputModel> {
		return this.sessionQueryRepository.findAllActiveSessions(
			cookie.userId,
			cookie.deviceId,
		);
	}

	@DeleteAllDeviceSessions()
	@UseGuards(JwtCookieGuard)
	@HttpCode(204)
	@Delete('terminate-all')
	async terminateAllSessionsExcludeCurrent(
		@CurrentSession() cookie: RefreshCookieInputModel,
	): Promise<void> {
		await this.commandBus.execute(
			new DevicesDeleteCommand(cookie.userId, cookie.deviceId),
		);
	}

	@DeleteDeviceSessionsByDeviceId()
	@UseGuards(JwtCookieGuard)
	@HttpCode(204)
	@Delete(':deviceId')
	async terminateSessionByDeviceId(
		@Param('deviceId') deviceId: string,
		@CurrentSession() cookie: RefreshCookieInputModel,
	): Promise<void> {
		if (!deviceId) {
			throw new NotFoundException();
		}
		await this.commandBus.execute(new DeviceDeleteCommand(cookie.userId, deviceId));
	}
}
