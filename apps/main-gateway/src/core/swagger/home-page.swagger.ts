import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HomePageOutputModel } from '../../features/home-page/api/models/output/home-page.output.models';

export function HomePageEndpoint() {
	return applyDecorators(
		ApiOperation({
			summary: 'Home Page',
		}),
		ApiResponse({
			status: 200,
			description: 'Return 4 last created posts with registered users count',
			type: HomePageOutputModel,
		}),
	);
}
