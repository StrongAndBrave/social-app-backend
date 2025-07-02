export class OAuthUserInputModel {
	providerName: string;
	providerId: string;
	fullUserName: string;
	email: string;
}

export interface OAuthUserCreateModel extends OAuthUserInputModel {
	username: string;
}
