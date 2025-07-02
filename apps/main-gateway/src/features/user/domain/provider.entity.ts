import { BaseEntity } from '../../../core/entities/base.entity';
import { OAuthUserInputModel } from '../api/models/input/oauth.user.input';

export class ProviderEntity extends BaseEntity {
	userId: string;
	providerId: string;
	providerName: string;
	fullUserName: string;

	constructor(userId: string, providerCreateModel: Omit<OAuthUserInputModel, 'email'>) {
		super();
		this.userId = userId;
		this.providerId = providerCreateModel.providerId;
		this.providerName = providerCreateModel.providerName;
		this.fullUserName = providerCreateModel.fullUserName;
		this.updatedAt = new Date();
	}
}
