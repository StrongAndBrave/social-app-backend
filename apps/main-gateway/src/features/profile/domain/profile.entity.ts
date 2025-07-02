import { BaseEntity } from '../../../core/entities/base.entity';

enum AccountType {
	Personal = 'Personal',
	Business = 'Business',
}

export class ProfileEntity extends BaseEntity {
	userId: string;
	accountType: AccountType;

	constructor(userId: string) {
		super();
		this.userId = userId;
		this.accountType = AccountType.Personal;
	}
}
