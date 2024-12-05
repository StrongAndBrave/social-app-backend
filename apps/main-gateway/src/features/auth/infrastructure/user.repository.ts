import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from 'apps/main-gateway/src/core/exceptions/domain-exceptions';
import { UserEntity } from '../domain/user.entity';
import { PrismaService } from 'apps/main-gateway/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';




@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async create(user: UserEntity): Promise<User> {
    return await this.prisma.user.create({ data: user });
  }

  async update(user: User): Promise<User> {
    return await this.prisma.user.update({ where: { id: user.id }, data: user });
  }

  async getByUsername(username: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async findOrNotFoundFail(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw NotFoundDomainException.create('User not found');
    }
    return user;
  }
}