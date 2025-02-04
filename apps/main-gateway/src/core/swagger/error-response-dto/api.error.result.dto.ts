import { ApiProperty } from '@nestjs/swagger';

class FieldError {
	@ApiProperty({})
	message: string;

	@ApiProperty({})
	field: string;
}

export class ApiErrorResultDto {
	@ApiProperty({})
	statusCode: number;

	@ApiProperty({
		isArray: true,
		type: () => FieldError,
	})
	messages: FieldError[];

	@ApiProperty({})
	error: string;
}
