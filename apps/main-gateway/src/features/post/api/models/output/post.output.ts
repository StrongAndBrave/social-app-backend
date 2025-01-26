export class PostOwnerInfo {
	ownerId: string;
	ownerName: string;
}

export class PostOutputModel {
	id: string;
	owner: PostOwnerInfo;
	description: string;
	image: string;
	createdAt: string;
}
