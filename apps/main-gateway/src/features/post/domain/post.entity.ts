import { BaseEntity } from '../../../core/entities/base.entity';
import { PostCreateModel } from '../api/models/input/post.input';

export class PostEntity extends BaseEntity {
	userId: string;
	description: string;

	constructor(postCreateData: PostCreateModel) {
		super();
		this.userId = postCreateData.userId;
		this.description = postCreateData.description;
	}
}
