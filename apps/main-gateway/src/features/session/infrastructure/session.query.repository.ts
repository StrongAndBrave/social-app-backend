import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/prisma/prisma.service';
import { SessionOutputModel } from '../api/models/output/session.output.model';

@Injectable()
export class SessionQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findAllActiveSessions(userId: string): Promise<SessionOutputModel[]> {
		const activeSessions = await this.prisma.session.findMany({
			where: { userId: userId, deletedAt: null },
		});
		return activeSessions.map((session) => ({
			deviceName: session.deviceName,
			ip: session.ip,
			lastVisit: session.createdAt.toISOString(),
		}));
	}
}
