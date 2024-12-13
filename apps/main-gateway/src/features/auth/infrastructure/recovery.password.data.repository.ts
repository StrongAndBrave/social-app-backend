import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/prisma/prisma.service';
import { Prisma, PasswordResetData } from '@prisma/client';
import { PasswordResetDataEntity } from '../domain/recovery.password.data.entity';

@Injectable()
export class RecoveryPasswordDataRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: PasswordResetDataEntity): Promise<PasswordResetData> {
    const passwordResetData: Prisma.PasswordResetDataCreateInput = { ...data, user: { connect: { id: data.userId } } };
    return this.prisma.passwordResetData.create({
      data: passwordResetData
    });
  }

  async update(params: {
    where: Prisma.PasswordResetDataWhereUniqueInput;
    data: Prisma.PasswordResetDataUpdateInput;
  }): Promise<PasswordResetData> {

    const { where, data } = params;
    return this.prisma.passwordResetData.update({
      data,
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async getByUnique(
    dataWhereUniqueInput: Prisma.PasswordResetDataWhereUniqueInput,
  ): Promise<PasswordResetData | null> {
    return this.prisma.passwordResetData.findUnique({
      where: {
        ...dataWhereUniqueInput,
        deletedAt: null,
      },
    });
  }

}