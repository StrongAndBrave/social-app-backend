import { BaseEntity } from '../../../core/entities/base.entity';

export class ProfileEntity extends BaseEntity {
	userId: string;

	constructor(userId: string) {
		super();
		this.userId = userId;
	}
}
