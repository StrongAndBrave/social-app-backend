import { IsDateString, IsOptional, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../core/decorators/transform/trim.decorator';

export interface ProfileCreateModel {
  userId: string;
}

export interface AvatarCreateModel {
  profileId: string;
  url: string;
  width: number;
  height: number;
  fileSize: number;
}

export class ProfileUpdateModel {

  @IsOptional()
  @Trim()
  @Length(6, 30)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  userName: string;

  @IsOptional()
  @Trim()
  @Length(1, 50)
  firstName: string;

  @IsOptional()
  @Trim()
  @Length(1, 50)
  lastName: string;

  @IsOptional()
  @Trim()
  @Length(0, 200)
  city: string;

  @IsOptional()
  @Trim()
  @Length(0, 200)
  country: string;

  @IsOptional()
  @Trim()
  @Length(0, 200)
  region: string;

  @IsOptional()
  @Trim()
  @IsDateString({}, { message: 'dateOfBirth must be a valid date string in ISO format' })
  dateOfBirth: string;

  @IsOptional()
  @Trim()
  @Length(0, 200)
  aboutMe: string;
}