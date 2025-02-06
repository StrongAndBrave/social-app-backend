import { applyDecorators } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
} from '@nestjs/swagger';
import { PostOutputModel } from '../../features/post/api/models/output/post.output';
import {
	ExtendedPostInputModel,
	NewDescriptionModel,
} from '../../features/post/api/models/input/post.input';
import { ApiErrorResultDto } from './error-response-dto/api.error.result.dto';

export function GetPostByUserIdEndpoint() {
	return applyDecorators(
		ApiOperation({
			summary: 'Get posts by userId',
		}),
		ApiParam({
			name: 'userId',
			required: true,
			description: 'UserId to find posts',
		}),
		ApiResponse({
			status: 200,
			type: PostOutputModel,
		}),
	);
}

export function CreatePostEndpoint() {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({
			summary: 'Create post',
		}),
		ApiBody({
			type: ExtendedPostInputModel,
		}),
		ApiResponse({
			status: 201,
			description:
				'The post has been successfully created. The response body contains the post data',
		}),
		ApiResponse({
			status: 400,
			description:
				'The inputModel has incorrect values or / No files uploaded / Invalid image format',
			type: ApiErrorResultDto,
		}),
		ApiResponse({
			status: 401,
			description: 'Unauthorized',
		}),
	);
}

export function UpdatePostEndpoint() {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({
			summary: 'Update post by id',
		}),
		ApiParam({
			name: 'postId',
			required: true,
		}),
		ApiBody({
			type: NewDescriptionModel,
		}),
		ApiResponse({
			status: 204,
			description: 'The post has been successfully updated',
		}),
		ApiResponse({
			status: 401,
			description: 'Unauthorized',
		}),
		ApiResponse({
			status: 403,
			description: 'Forbidden',
		}),
		ApiResponse({
			status: 404,
			description: 'The post has not been found',
		}),
	);
}

export function DeletePostEndpoint() {
	return applyDecorators(
		ApiBearerAuth(),
		ApiParam({
			name: 'postId',
			required: true,
		}),
		ApiResponse({
			status: 204,
			description: 'The post has been successfully deleted',
		}),
		ApiResponse({
			status: 401,
			description: 'Unauthorized',
		}),
		ApiResponse({
			status: 403,
			description: 'Forbidden',
		}),
		ApiResponse({
			status: 404,
			description: 'The post has not been found',
		}),
	);
}
