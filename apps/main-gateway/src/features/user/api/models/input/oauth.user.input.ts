export class OAuthUserInputModel {
	provider: string;
	providerId: string;
	fullName: string;
	email: string;
}

export interface OAuthUserCreateModel extends OAuthUserInputModel {
	username: string;
}
