import { BaseEntity } from "apps/main-gateway/src/core/entities/base.entity";

export class UserEntity extends BaseEntity {
  email: string;
  login: string;
  passwordHash: string;
  confirmationCode: string | null = null;
  codeExpirationDate: Date | null = null;
  isConfirmed: boolean = false;

  constructor(email: string, login: string, passwordHash: string, ) {
    super();
    this.email = email;
    this.login = login;
    this.passwordHash = passwordHash;
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