import { Injectable } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';
import { SessionEntity } from '../domain/session.entity';
import { PrismaService } from '../../../../../../libs/prisma/prisma.service';

@Injectable()
export class SessionRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: SessionEntity): Promise<Session> {
		const session: Prisma.SessionCreateInput = {
			...data,
			user: { connect: { id: data.userId } },
		};
		return this.prisma.session.create({
			data: session,
		});
	}

	async update(params: {
		where: Prisma.SessionWhereUniqueInput;
		data: Prisma.SessionUpdateInput;
	}): Promise<Session> {
		const { where, data } = params;
		return this.prisma.session.update({
			data,
			where: {
				...where,
				deletedAt: null,
			},
		});
	}

	async getByUnique(
		dataWhereUniqueInput: Prisma.SessionWhereUniqueInput,
	): Promise<Session | null> {
		return this.prisma.session.findUnique({
			where: {
				...dataWhereUniqueInput,
				deletedAt: null,
			},
		});
	}

	async softDeleteById(id: string): Promise<Session> {
		return this.prisma.session.update({
			where: { id },
			data: { deletedAt: new Date() },
		});
	}

	async softDeleteSessionsExcludeId(deviceId: string, userId: string) {
		return this.prisma.session.updateMany({
			where: { id: { not: deviceId }, userId },
			data: { deletedAt: new Date() },
		});
	}
}
