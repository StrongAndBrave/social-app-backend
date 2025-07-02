import { Module } from '@nestjs/common';
import { HomePageController } from './api/home-page.controller';
import { HomePageQueryRepository } from './infrastructure/home-page.query.repository';

@Module({
	imports: [],
	controllers: [HomePageController],
	providers: [
		{
			provide: HomePageQueryRepository.name,
			useClass: HomePageQueryRepository,
		},
	],
})
export class HomePageModule {}
