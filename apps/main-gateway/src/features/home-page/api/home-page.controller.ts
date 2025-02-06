import { Controller, Get, HttpCode, Inject } from '@nestjs/common';
import { HomePageQueryRepository } from '../infrastructure/home-page.query.repository';
import { HomePageEndpoint } from '../../../core/swagger/home-page.swagger';

@Controller('home-page')
export class HomePageController {
	constructor(
		@Inject(HomePageQueryRepository.name)
		private readonly homePageQueryRepository: HomePageQueryRepository,
	) {}

	@HomePageEndpoint()
	@Get()
	@HttpCode(200)
	async homePageReq() {
		return this.homePageQueryRepository.usersCountAndPosts();
	}
}
