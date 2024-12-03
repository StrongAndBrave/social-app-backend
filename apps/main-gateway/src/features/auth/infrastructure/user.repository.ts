import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NotFoundDomainException } from 'apps/main-gateway/src/core/exceptions/domain-exceptions';


@Injectable()
export class UserRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async save(user: User): Promise<User> {
    return await this.prisma.user.create({ data: user });
  }

  async getByUsername(username: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async findOrNotFoundFail(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique(id);

    if (!user) {
      throw NotFoundDomainException.create('User not found');
    }
    return user;
  }
}