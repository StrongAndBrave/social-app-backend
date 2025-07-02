import { applyDecorators } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiCookieAuth,
	ApiOperation,
	ApiResponse,
} from '@nestjs/swagger';

import {
	LoginInputModelType,
	UserInputModel,
} from '../../features/user/api/models/input/user.input';
import { UserAuthMeDTO } from '../../features/user/api/models/output/user.output';
import { ReturnAccessJWTforSwagger } from '../../features/auth/api/models/output/auth.output.models';
import {
	EmailResendingModel,
	NewPasswordModel,
	ValidationCodeModel,
} from '../../features/auth/api/models/input/auth.input.models';
import { ApiErrorResultDto } from './error-response-dto/api.error.result.dto';

export function RegistrationUserEndpoint() {
	return applyDecorators(
		ApiOperation({
			summary:
				'Registration in the system. Email with confirmation code will be snd to passed email address',
		}),
		ApiBody({
			description: 'Data for constructing a new User entity',
			type: UserInputModel,
		}),
		ApiResponse({
			status: 400,
			description:
				'If the inputModel has incorrect values (in particular if the user with the given email or login already exists). ' +
				'And temporary solution, if email already exist: "Registration user command found user by the same email",' +
				' if userName already exist: "Registration user command found user by the same userName"',
			type: ApiErrorResultDto,
		}),
		ApiResponse({
			status: 429,
			description: 'More than 5 attempts from one IP-address during 10 seconds',
		}),
		ApiResponse({
			status: 204,
			description:
				'Input data is accepted. Email with confirmation code will be send to passed email address',
		}),
	);
}

export function LoginUserEndpoint() {
	return applyDecorators(
		ApiOperation({ summary: 'Try login user to the system' }),
		ApiBody({
			description: 'Credentials for enter to the system',
			type: () => LoginInputModelType,
		}),
		ApiResponse({
			status: 200,
			description:
				'Returns JWT accessToken (expired after 5 minutes) in body and JWT refreshToken in cookie (http-only, secure) (expired after 24 hours).',
			type: () => ReturnAccessJWTforSwagger,
		}),
		ApiResponse({
			status: 400,
			description: 'If the inputModel has incorrect values',
			type: ApiErrorResultDto,
		}),
		ApiResponse({
			status: 401,
			description: 'If the password or login is wrong',
		}),
		ApiResponse({
			status: 429,
			description: 'More than 5 attempts from one IP-address during 10 seconds',
		}),
	);
}

export function RegEmailResendingEndpoint() {
	return applyDecorators(
		ApiOperation({
			summary: 'Resend confirmation registration Email if user exists',
		}),
		ApiBody({
			description: 'Data for constructing a new User entity',
			type: EmailResendingModel,
		}),
		ApiResponse({
			status: 204,
			description:
				'Input data is accepted.Email with confirmation code will be send to passed email address.Confirmation code should be inside link as query param,' +
				' for example: https://some-front.com/confirm-registration?code=youtcodehere',
		}),
		ApiResponse({
			status: 400,
			description: 'If the inputModel has incorrect values',
			type: ApiErrorResultDto,
		}),
		ApiResponse({
			status: 429,
			description: 'More than 5 attempts from one IP-address during 10 seconds',
		}),
	);
}

export function RegConfirmationEndpoint() {
	return applyDecorators(
		ApiOperation({ summary: 'Confirm registration' }),
		ApiBody({
			type: ValidationCodeModel,
		}),
		ApiResponse({
			status: 204,
			description: 'Email was verified. Account was activated',
		}),
		ApiResponse({
			status: 400,
			description:
				'If the confirmation code is incorrect, expired or already been applied',
			type: ApiErrorResultDto,
		}),
		ApiResponse({
			status: 429,
			description: 'More than 5 attempts from one IP-address during 10 seconds',
		}),
	);
}

export function PasswordRecoveryEndpoint() {
	// todo add recaptcha
	return applyDecorators(
		ApiOperation({
			summary:
				'Password recovery via Email confirmation.Email should be sent with Recovery Code inside',
		}),
		ApiResponse({
			status: 204,
			description:
				"Even if current email is not registered (for prevent user's email detection)",
		}),
		ApiResponse({
			status: 400,
			description: 'If the inputModel has invalid email (for example 222^gmail.com)',
		}),
		ApiResponse({
			status: 429,
			description: 'More than 5 attempts from one IP-address during 10 seconds',
		}),
	);
}

export function NewPasswordEndpoint() {
	return applyDecorators(
		ApiOperation({ summary: 'Confirm Password recovery' }),
		ApiBody({ type: NewPasswordModel }),
		ApiResponse({
			status: 204,
			description: 'If code is valid and new password is accepted',
		}),
		ApiResponse({
			status: 400,
			description:
				'If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired',
		}),
		ApiResponse({
			status: 429,
			description: 'More than 5 attempts from one IP-address during 10 seconds',
		}),
	);
}

export function LogoutEndpoint() {
	return applyDecorators(
		ApiCookieAuth('refreshToken'),
		ApiOperation({
			summary: 'In cookie client must send correct refreshToken that will be revoked',
		}),
		ApiResponse({
			status: 204,
			description: 'Success',
		}),
		ApiResponse({
			status: 401,
			description: 'Unauthorized',
		}),
		ApiResponse({
			status: 429,
			description: 'More than 5 attempts from one IP-address during 10 seconds',
		}),
	);
}

export function RefreshTokenEndpoint() {
	return applyDecorators(
		ApiCookieAuth('refreshToken'),
		ApiOperation({
			summary:
				'Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken' +
				'tht will be revoked after refreshing) Device LastActiveDate should be overrode by issued Date of new refresh token',
		}),
		ApiResponse({
			status: 200,
			description:
				'Returns JWT accessToken (expired after 5 minutes) in body and JWT refreshToken in cookie (http-only, secure) (expired after 24 hours).',
			type: ReturnAccessJWTforSwagger,
		}),
		ApiResponse({
			status: 401,
			description: 'Unauthorized',
		}),
		ApiResponse({
			status: 429,
			description: 'More than 5 attempts from one IP-address during 10 seconds',
		}),
	);
}

export function AuthMeEndpoint() {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({
			summary: 'Get information about current user',
		}),
		ApiResponse({
			status: 200,
			description: 'Success',
			type: UserAuthMeDTO,
		}),
		ApiResponse({
			status: 401,
			description: 'Unauthorized',
		}),
		ApiResponse({
			status: 429,
			description: 'More than 5 attempts from one IP-address during 10 seconds',
		}),
	);
}

export function GoogleOAuthEndpoint() {
	return applyDecorators(
		ApiOperation({ summary: 'Login via Google OAuth' }),
		ApiResponse({
			status: 200,
			description: 'Success, returns access token in body and refresh token as a cookie',
		}),
		ApiResponse({
			status: 400,
			description: 'No received data from Google or email hidden',
		}),
		ApiResponse({
			status: 429,
			description: 'More than 5 attempts from one IP-address during 10 seconds',
		}),
	);
}

export function GithubOAuthEndpoint() {
	return applyDecorators(
		ApiOperation({ summary: 'Login via Github OAuth' }),
		ApiResponse({
			status: 200,
			description: 'Success, returns access token in body and refresh token as a cookie',
		}),
		ApiResponse({
			status: 400,
			description: 'No received data from Github or email hidden',
		}),
		ApiResponse({
			status: 429,
			description: 'More than 5 attempts from one IP-address during 10 seconds',
		}),
	);
}
