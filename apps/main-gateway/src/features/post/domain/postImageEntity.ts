import { PostImageCreateModel } from '../api/models/input/post.input';

export class PostImageEntity {
	postId: string;
	imagesUrl: string[];

	constructor(postImageCreateData: PostImageCreateModel) {
		this.postId = postImageCreateData.postId;
		this.imagesUrl = postImageCreateData.images;
	}
}
