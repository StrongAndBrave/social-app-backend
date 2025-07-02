import { Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/transform/trim.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class PostInputModel {
	@ApiProperty()
	@Trim()
	@Length(0, 500)
	description: string;
}

export class ExtendedPostInputModel extends PostInputModel {
	@ApiProperty()
	images: string[];
}

export interface PostCreateModel extends PostInputModel {
	userId: string;
}

export interface PostImageCreateModel {
	postId: string;
	images: string[];
}

export class NewDescriptionModel {
	@ApiProperty({})
	@Trim()
	@Length(0, 500)
	description: string;
}
