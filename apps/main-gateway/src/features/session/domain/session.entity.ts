import { BaseEntity } from "../../../core/entities/base.entity";
import { SessionCreateModel } from "../api/models/input/create.session.model";

export class SessionEntity extends BaseEntity {
  userId: string
  ip: string;
  deviceName: string;
  expirationDate: Date

  constructor(sessionCreateModel: SessionCreateModel) {
    super();
    this.userId = sessionCreateModel.userId
    this.ip = sessionCreateModel.ip ?? 'Unknown';
    this.deviceName = sessionCreateModel.deviceName ?? 'Unknown';
    this.expirationDate = sessionCreateModel.expirationDate
    this.updatedAt = new Date();
  }
}