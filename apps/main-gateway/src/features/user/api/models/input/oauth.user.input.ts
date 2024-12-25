export class OauthUserInputModel {
	provider: string;
	providerId: string;
	fullName: string;
	email: string;
}

export interface OAuthUserCreateModel extends OauthUserInputModel {
	username: string;
}
