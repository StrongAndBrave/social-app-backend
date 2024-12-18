import { Controller, Get, HttpCode, Inject, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { CommandBus } from '@nestjs/cqrs';

@Controller('auth')
export class OAuth2Controller {
	constructor(
		private readonly commandBus: CommandBus,
		@Inject(AuthService.name) private readonly authService: AuthService,
	) {}

	@Get('github/login')
	@HttpCode(200)
	async loginWithGithub() {}

	@Post('google/register')
	@HttpCode(201)
	async loginWithGoogle() {}
}
