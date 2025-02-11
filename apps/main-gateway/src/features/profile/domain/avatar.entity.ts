import { AvatarCreateModel } from "../api/models/input/profile.input.models";

export class AvatarEntity {
	profileId: string;
	url: string;
  width: number;
  height: number;
  fileSize: number;

	constructor(avatarCreateData: AvatarCreateModel) {
		this.profileId = avatarCreateData.profileId;
		this.url = avatarCreateData.url;
    this.width = avatarCreateData.width;
    this.height = avatarCreateData.height;
    this.fileSize = avatarCreateData.fileSize;
	}
}