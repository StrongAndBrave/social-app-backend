import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import { AuthConfig } from '../../features/auth/auth.config';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(@Inject(AuthConfig.name) private readonly authConfig: AuthConfig) {
		super({
			clientID: authConfig.googleOAuthClientId,
			clientSecret: authConfig.googleOAuthSecretKey,
			callbackURL: authConfig.googleOAuthCallbackUrl,
			scope: ['email', 'profile'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
		const { name, emails } = profile;
		return {
			email: emails[0].value,
			firstName: name.givenName,
			lastName: name.familyName,
			accessToken,
			refreshToken,
		};
	}
}
