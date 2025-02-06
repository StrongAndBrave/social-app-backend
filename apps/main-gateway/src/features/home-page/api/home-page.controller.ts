import { Controller, Get, HttpCode, Inject } from '@nestjs/common';
import { HomePageQueryRepository } from '../infrastructure/home-page.query.repository';

@Controller('home-page')
export class HomePageController {
	constructor(
		@Inject(HomePageQueryRepository.name)
		private readonly homePageQueryRepository: HomePageQueryRepository,
	) {}

	@Get()
	@HttpCode(200)
	async homePageReq() {
		return this.homePageQueryRepository.usersCountAndPosts();
	}
}
