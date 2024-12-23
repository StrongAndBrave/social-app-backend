import { Trim } from '../../../../../core/decorators/transform/trim.decorator';
import { IsEmail } from 'class-validator';

export class OauthUserInputModel {
	@Trim()
	@IsEmail()
	email: string;
}

export interface OAuthUserCreateModel extends OauthUserInputModel {
	username: string;
}
