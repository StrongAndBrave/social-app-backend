import { Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/transform/trim.decorator';

export class PostInputModel {
	@Trim()
	@Length(0, 500)
	description: string;
}

export interface PostCreateModel extends PostInputModel {
	userId: string;
}

export interface PostImageCreateModel {
	postId: string;
	images: string[];
}

export class NewDescriptionModel {
	@Trim()
	@Length(0, 500)
	description: string;
}
