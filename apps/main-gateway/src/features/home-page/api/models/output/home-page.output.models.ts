import { PostOutputModel } from '../../../../post/api/models/output/post.output';
import { ApiProperty } from '@nestjs/swagger';

export class HomePageOutputModel {
	@ApiProperty()
	registeredUsersCount: number;

	@ApiProperty()
	posts: PostOutputModel[];
}
