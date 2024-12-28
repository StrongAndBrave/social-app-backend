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
		const { id, name, emails } = profile;
		const user = {
			providerName: 'Google',
			providerId: id,
			email: emails && emails.length > 0 ? emails[0].value : null,
			fullUserName: `${name.givenName} ${name.familyName}`,
		};
		return user ?? null;
	}
}
