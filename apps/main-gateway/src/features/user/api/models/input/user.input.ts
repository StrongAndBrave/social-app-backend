import { IsEmail, IsString, Length, Matches } from "class-validator";
import { Trim } from "apps/main-gateway/src/core/transform/trim.decorator";


export class UserInputModel {
  // @ApiProperty({
  //   required: true,
  //   description: 'User name',
  //   minLength: 6,
  //   maxLength: 15,
  //   pattern: '^[a-zA-Z0-9_-]*$',
  // })
  @Trim()
  @Length(6, 30)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  username: string;

  // @ApiProperty({
  //   required: true,
  //   description: 'Password',
  //   minLength: 6,
  //   maxLength: 20,
  //   example: 'string',
  //   pattern:
  //     '^(?=.*[0-9])(?=.*[A-Z])(?=.*[! "#$%&\'()*+,-./:;<=>?@[\\\\\\]^_`{|}~]).*$',
  // })
  @Trim()
  @Length(6, 20)
  password: string;

  // @ApiProperty({
  //   required: true,
  //   description: 'Email',
  //   example: 'example@example.com',
  //   pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  // })
  @Trim()
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}


export interface UserCreateModel extends UserInputModel {
  passwordHash: string;
}

// export interface UserQueryData extends QueryPaginationModel {
//   searchLoginTerm?: string;
//   searchEmailTerm?: string;
// }

// export interface UserSortData extends QuerySortModel {
//   searchLoginTerm: string | null;
//   searchEmailTerm: string | null;
// }


