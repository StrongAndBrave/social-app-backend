import { IsEmail, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/transform/trim.decorator';
import { ConfCodeIsValid } from '../../../../../core/decorators/validate/confirmation-code.decorator';
import { EmailIsConfirmed } from '../../../../../core/decorators/validate/email-is-confirmed.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidationCodeModel {
	@ApiProperty({
		required: true,
		description: 'Code that be sent via Email inside link',
	})
	@Trim()
	@ConfCodeIsValid()
	code: string;
}

export class EmailResendingModel {
	@ApiProperty({
		required: true,
		description: 'Email User for recovery',
		example: 'example@example.com',
		pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
	})
	@Trim()
	@IsEmail()
	@EmailIsConfirmed()
	email: string;
}

export class NewPasswordModel {
	@ApiProperty({
		required: true,
		description: 'New account recovery password',
		minLength: 6,
		maxLength: 20,
		pattern:
			'/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!"#$%&\'()*+,-.\\/:;<=>?@[\\]^_`{|}~])[A-Za-z0-9!"#$%&\'()*+,-.\\/:;<=>?@[\\]^_`{|}~]+$/',
		example: 'Ex4mple!',
	})
	@Trim()
	@Length(6, 20)
	newPassword: string;

	@ApiProperty({
		required: true,
		description: 'Code that be sent via Email inside link',
	})
	@Trim()
	recoveryCode: string;
}
