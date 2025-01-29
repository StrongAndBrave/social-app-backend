export class PostOwnerInfo {
	ownerId: string;
	ownerName: string;
}

export class PostImageModel {
	image: string;
}

export class PostOutputModel {
	id: string;
	owner: PostOwnerInfo;
	description: string;
	images: PostImageModel[];
	createdAt: string;
}
