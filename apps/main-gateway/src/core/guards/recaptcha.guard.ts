import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import * as process from 'node:process';

@Injectable()
export class RecaptchaGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const { body } = await context.switchToHttp().getRequest();
		const result = await fetch('https://www.google.com/recaptcha/api/siteverify', {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
			body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${body.recaptcha}`,
		});
		const response = await result.json();
		if (!response.success) {
			throw new UnauthorizedException();
		}
		return true;
	}
}
