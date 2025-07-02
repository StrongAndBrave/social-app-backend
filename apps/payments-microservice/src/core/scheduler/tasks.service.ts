import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
	constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

	@Cron(CronExpression.EVERY_DAY_AT_1PM)
	async deleteSubscription() {
		try {
			await this.sequelize.query(`
				DELETE FROM public."Subscriptions"
					WHERE "expiredAt" IS NOT NULL AND "expiredAt" < NOW()
		`);
		} catch (e) {
			console.error(e);
		}
	}

	@Cron(CronExpression.EVERY_DAY_AT_1PM)
	async changePaymentStatus() {
		try {
			await this.sequelize.query(`
					UPDATE public."SubscriptionPayments"
						SET "status" = 'failure', "updatedAt" = NOW()
						WHERE /*"createdAt" < NOW() - INTERVAL '1 day' AND*/ "status" = 'pending'
			`);
		} catch (e) {
			console.error(e);
		}
	}
}
