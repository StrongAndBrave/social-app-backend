import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Inject,
	Ip,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { UserRegistrationCommand } from '../application/use-cases/registration-user.use-case';
import { UserInputModel } from '../../user/api/models/input/user.input';
import { AuthService } from '../application/auth.service';
import { UserRepository } from '../../user/infrastructure/user.repository';
import {
	EmailResendingModel,
	NewPasswordModel,
	ValidationCodeModel,
} from './models/input/auth.input.models';
import { RegistrationConfirmationCommand } from '../application/use-cases/registration-confirmation.use-case';
import { UserLoginCommand } from '../application/use-cases/login-user.use-case';
import { PasswordRecoveryCommand } from '../application/use-cases/password-recovery.use-case';
import { SetNewPasswordCommand } from '../application/use-cases/set-new-password.use-case';
import { RefreshTokensCommand } from '../application/use-cases/refresh-token.use-case';
import { RefreshCookieInputModel } from '../../session/api/models/input/refresh.cookie.model';
import { DeviceDeleteCommand } from '../../session/application/use-cases/delete.device.use-case';
import { RecaptchaGuard } from '../../../core/guards/recaptcha.guard';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUserId } from '../../../core/decorators/transform/current-user-id.param.decorator';
import { LocalAuthGuard } from '../../../core/guards/local-auth.guard';
import { UserAgent } from '../../../core/decorators/transform/user-agent.from.headers.decorator';
import { JwtCookieGuard } from '../../../core/guards/jwt-cookie.guard';

@Controller('auth')
export class AuthController {
	constructor(
		private commandBus: CommandBus,
		@Inject(AuthService.name) private readonly authService: AuthService,
		@Inject(UserRepository.name) private readonly userRepository: UserRepository,
	) {}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	async getMe(
		@CurrentUserId() userId: string,
	): Promise<{ email: string; username: string; userId: string }> {
		const user = await this.userRepository.getByUnique({ id: userId });
		if (!user) throw new HttpException(`user do not exist`, HttpStatus.NOT_FOUND);
		const outputUser = {
			email: user.email,
			username: user.username,
			userId: user.id.toString(),
		};
		return outputUser;
	}

	@Post('registration')
	@HttpCode(204)
	async registration(@Body() newUser: UserInputModel): Promise<void> {
		const res = await this.commandBus.execute(new UserRegistrationCommand(newUser));
		if (!res)
			throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
		return;
	}

	@Post('registration-confirmation')
	@HttpCode(204)
	async registrationConfirmation(@Body() body: ValidationCodeModel): Promise<void> {
		const res = await this.commandBus.execute(
			new RegistrationConfirmationCommand(body.code),
		);
		if (!res)
			throw new HttpException(
				`The confirmation code is incorrect, expired or already been applied`,
				HttpStatus.BAD_REQUEST,
			);
		return;
	}

	@Post('registration-email-resending')
	@HttpCode(204)
	async emailResend(@Body() body: EmailResendingModel): Promise<void> {
		await this.authService.resendEmail(body.email);
		return;
	}

	@Post('login')
	@UseGuards(LocalAuthGuard)
	@HttpCode(200)
	async login(
		@CurrentUserId() userId: string,
		@UserAgent() deviceName: string,
		@Ip() ip: string,
		@Res({ passthrough: true }) res: Response,
	): Promise<{ accessToken: string }> {
		const tokens = await this.commandBus.execute(
			new UserLoginCommand(userId, deviceName, ip),
		);
		res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });
		return { accessToken: tokens.accessToken };
	}

	@UseGuards(RecaptchaGuard)
	@Post('password-recovery')
	@HttpCode(204)
	async passwordRecovery(@Body() body: EmailResendingModel): Promise<void> {
		await this.commandBus.execute(new PasswordRecoveryCommand(body.email));
		return;
	}

	@Post('new-password')
	@HttpCode(204)
	async setNewPassword(@Body() body: NewPasswordModel): Promise<void> {
		await this.commandBus.execute(
			new SetNewPasswordCommand(body.newPassword, body.recoveryCode),
		);
		return;
	}

	@Post('logout')
	@UseGuards(JwtCookieGuard)
	@HttpCode(204)
	async logout(@CurrentUserId() cookie: RefreshCookieInputModel): Promise<void> {
		await this.commandBus.execute(
			new DeviceDeleteCommand(cookie.userId, cookie.deviceId),
		);
		return;
	}

	@Post('update-tokens')
	@UseGuards(JwtCookieGuard)
	@HttpCode(200)
	async refreshToken(
		@Res({ passthrough: true }) res: Response,
		@CurrentUserId() cookie: RefreshCookieInputModel,
	): Promise<{ accessToken: string }> {
		const result = await this.commandBus.execute(
			new RefreshTokensCommand(cookie.deviceId),
		);
		res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true });
		return { accessToken: result.accessToken };
	}
}
