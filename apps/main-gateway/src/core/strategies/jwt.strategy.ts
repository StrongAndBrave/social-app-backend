import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../../features/user/infrastructure/user.repository';
import { AuthConfig } from '../../features/auth/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(UserRepository.name) private readonly userRepository: UserRepository,
		@Inject(AuthConfig.name) private readonly authConfig: AuthConfig,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: authConfig.secretAccess,
		});
	}

	async validate(payload: any) {
		const user = await this.userRepository.getByUnique({ id: payload.userId });
		if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		return payload.userId;
	}
}
