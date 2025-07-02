import { BaseEntity } from "../../../core/entities/base.entity";
import { PasswordResetDataCreateModel } from "../api/models/input/password.recovery.password.data.create.model";

export class PasswordResetDataEntity extends BaseEntity {
  recoveryCode: string;
  expirationDate: Date
  isConfirmed: boolean;
  userId: string

  constructor(dataModel: PasswordResetDataCreateModel) {
    super();
    this.recoveryCode = dataModel.recoveryCode;
    this.expirationDate = dataModel.expirationDate;
    this.userId = dataModel.userId
    this.isConfirmed = false
  }
}