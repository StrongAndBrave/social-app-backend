import { BaseEntity } from "../../../core/entities/base.entity";
import { UserCreateModel } from "../api/models/input/user.input";

export class UserEntity extends BaseEntity {
  email: string;
  username: string;
  passwordHash: string;
  confirmationCode: string | null = null;
  codeExpirationDate: Date | null = null;
  isConfirmed: boolean = false;

  constructor(userCreateData: UserCreateModel) {
    super();
    this.email = userCreateData.email;
    this.username = userCreateData.username;
    this.passwordHash = userCreateData.passwordHash;
  }

  addConfirmData(confirmCode: string, expirationDate: Date) {
    this.confirmationCode = confirmCode;
    this.codeExpirationDate = expirationDate;
  }

  confirmEmail() {
    this.isConfirmed = true
  }

  updatePassword(passwordHash: string) {
    this.passwordHash = passwordHash
  }
}