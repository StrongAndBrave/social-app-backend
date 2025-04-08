import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
	imports: [ScheduleModule.forRoot(), DatabaseModule],
	providers: [TasksService],
})
export class SchedulerModule {}
