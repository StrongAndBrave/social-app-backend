import { UserCreateModel } from '../api/models/input/user.input';
import { OAuthUserCreateModel } from '../api/models/input/oauth.user.input';
import { BaseEntity } from '../../../core/entities/base.entity';

export class UserEntity extends BaseEntity {
	email: string;
	username: string;
	passwordHash: string;
	confirmationCode: string | null = null;
	codeExpirationDate: Date | null = null;
	isConfirmed: boolean = false;

	static create(userCreateData: UserCreateModel) {
		const user = new UserEntity();
		user.email = userCreateData.email;
		user.username = userCreateData.username;
		user.passwordHash = userCreateData.passwordHash;
		return user;
	}

	static createWithOAuth(userCreateData: OAuthUserCreateModel) {
		const user = new UserEntity();
		user.email = userCreateData.email;
		user.username = userCreateData.username;
		return user;
	}

	addConfirmData(confirmCode: string, expirationDate: Date) {
		this.confirmationCode = confirmCode;
		this.codeExpirationDate = expirationDate;
	}

	confirmEmail() {
		this.isConfirmed = true;
	}

	updatePassword(passwordHash: string) {
		this.passwordHash = passwordHash;
	}
}
