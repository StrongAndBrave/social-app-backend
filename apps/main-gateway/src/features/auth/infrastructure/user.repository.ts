import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NotFoundDomainException } from 'apps/main-gateway/src/core/exceptions/domain-exceptions';
import { UserEntity } from '../domain/user.entity';
import { PrismaService } from 'apps/main-gateway/prisma/prisma.service';


@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: UserEntity): Promise<UserEntity> {
    return await this.prisma.user.create({ data: user });
  }

  async update(user: UserEntity): Promise<UserEntity> {
    return await this.prisma.user.update({ where: { id: user.id }, data: user });
  }

  async getByUsername(username: string): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async findOrNotFoundFail(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw NotFoundDomainException.create('User not found');
    }
    return user;
  }
}