import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/prisma/prisma.service';
import { AvatarEntity } from '../domain/avatar.entity';
import { Avatar } from '@prisma/client';


@Injectable()
export class AvatarRepository {
  constructor(private readonly prisma: PrismaService) { }

  async save(data: AvatarEntity): Promise<Avatar> {
    return this.prisma.avatar.create({ data });
  }

  async findByProfileId(profileId: string): Promise<Avatar[]> {
    return this.prisma.avatar.findMany({ where: { profileId: profileId } });
  }

  async deleteByUserId(userId: string) {
    return this.prisma.avatar.deleteMany({ where: { profile: { userId } } });
  }
}