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
	@Trim()
	@IsEmail()
	@EmailIsConfirmed()
	email: string;
}

export class NewPasswordModel {
	@Trim()
	@Length(6, 20)
	newPassword: string;
	@Trim()
	recoveryCode: string;
}
