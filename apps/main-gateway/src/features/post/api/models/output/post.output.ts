import { ApiProperty } from '@nestjs/swagger';

export class PostOwnerInfo {
	@ApiProperty()
	ownerId: string;

	@ApiProperty()
	ownerName: string;
}

export class PostImageModel {
	@ApiProperty()
	image: string;
}

export class PostOutputModel {
	@ApiProperty()
	id: string;

	@ApiProperty({ type: PostOwnerInfo })
	owner: PostOwnerInfo;

	@ApiProperty()
	description: string;

	@ApiProperty({ type: [PostImageModel] })
	images: PostImageModel[];

	@ApiProperty()
	createdAt: string;
}
