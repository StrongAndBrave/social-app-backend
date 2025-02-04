import { ApiProperty } from '@nestjs/swagger';

export class UserAuthMeDTO {
	@ApiProperty({
		example: 'string',
	})
	userId: string;
	@ApiProperty({
		example: 'string',
	})
	username: string;
	@ApiProperty({
		example: 'string',
	})
	email: string;
}
