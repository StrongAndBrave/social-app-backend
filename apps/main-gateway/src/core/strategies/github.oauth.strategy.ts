import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { AuthConfig } from '../../features/auth/auth.config';

@Injectable()
export class GithubOAuthStrategy extends PassportStrategy(Strategy, 'github') {
	constructor(@Inject(AuthConfig.name) private readonly authConfig: AuthConfig) {
		super({
			clientID: authConfig.githubOAuthClientId,
			clientSecret: authConfig.githubOAuthSecretKey,
			callbackURL: authConfig.githubOAuthCallbackUrl,
			scope: ['user:email'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
		const { id, displayName, username, emails } = profile;
		const user = {
			providerName: 'Github',
			providerId: id,
			email: emails && emails.length > 0 ? emails[0].value : null,
			fullUserName: username || displayName,
		};
		return user ?? null;
	}
}
