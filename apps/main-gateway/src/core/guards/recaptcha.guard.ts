import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthConfig } from '../../features/auth/auth.config';

@Injectable()
export class RecaptchaGuard implements CanActivate {
	constructor(@Inject(AuthConfig.name) private readonly authConfig: AuthConfig) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const { body } = await context.switchToHttp().getRequest();
		if (!body.recaptcha) {
			throw new UnauthorizedException();
		}
		const result = await fetch('https://www.google.com/recaptcha/api/siteverify', {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
			body: `secret=${this.authConfig.recaptchaSecretKey}&response=${body.recaptcha}`,
		});
		const response = await result.json();
		if (!response.success) {
			throw new UnauthorizedException();
		}
		return true;
	}
}
