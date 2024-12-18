import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from 'apps/main-gateway/src/core/exceptions/domain-exceptions';
import { PrismaService } from 'libs/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {

    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async getByUnique(
    dataWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        ...dataWhereUniqueInput,
        deletedAt: null,
      },
    });
  }

  async getByUsernameOrEmail(loginOrEmail: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ username: loginOrEmail, deletedAt: null }, { email: loginOrEmail, deletedAt: null }],
      },
    });
  }

  async findOrNotFoundFail(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id, deletedAt: null } });

    if (!user) {
      throw NotFoundDomainException.create('User not found');
    }
    return user;
  }


}