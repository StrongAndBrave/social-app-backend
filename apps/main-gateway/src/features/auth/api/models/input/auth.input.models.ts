import { IsEmail, Length } from "class-validator";
import { Trim } from "apps/main-gateway/src/core/decorators/transform/trim.decorator";
import { ConfCodeIsValid } from "apps/main-gateway/src/core/decorators/validate/confirmation-code.decorator";
import { EmailIsConfirmed } from "apps/main-gateway/src/core/decorators/validate/email-is-confirmed.decorator";


export class ValidationCodeModel {
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
  recoveryCode: string
}