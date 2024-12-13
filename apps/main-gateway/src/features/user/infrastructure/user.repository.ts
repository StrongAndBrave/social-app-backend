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
      where,
    });
  }

  async getByUnique(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async getByUsernameOrEmail(loginOrEmail: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ username: loginOrEmail }, { email: loginOrEmail }],
      },
    });
  }

  async findOrNotFoundFail(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw NotFoundDomainException.create('User not found');
    }
    return user;
  }


}