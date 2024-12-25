import { BaseEntity } from '../../../core/entities/base.entity';

export class ProviderEntity extends BaseEntity {
	userId: string;
	providerId: string;
	providerName: string;
	fullUserName: string;
}
