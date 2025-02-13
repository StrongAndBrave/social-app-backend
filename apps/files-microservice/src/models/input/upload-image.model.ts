export interface UploadImageModel {
	userId: string;
	fileBuffer: Buffer;
	imageType: UploadImageTypeEnum;
}

export enum UploadImageTypeEnum {
	AVATAR = 'avatar',
	POST = 'post',
}


