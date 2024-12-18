import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/prisma/prisma.service';
import { SessionOutputModel } from '../api/models/output/session.output.model';

@Injectable()
export class SessionQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findAllActiveSessions(
		userId: string,
		deviceId: string,
	): Promise<SessionOutputModel> {
		const activeSessions = await this.prisma.session.findMany({
			where: { userId: userId, deletedAt: null, id: { not: deviceId } },
		});
		const currentSession = await this.prisma.session.findUnique({
			where: { id: deviceId },
		});
		return {
			current: {
				deviceName: currentSession!.deviceName,
				ip: currentSession!.ip,
				lastVisit: currentSession!.createdAt.toISOString(),
			},
			others:
				activeSessions.map((session) => ({
					deviceName: session.deviceName,
					ip: session.ip,
					lastVisit: session.createdAt.toISOString(),
				})) || [],
		};
	}
}
