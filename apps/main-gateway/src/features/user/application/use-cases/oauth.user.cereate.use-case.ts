import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/user.repository';
import { UserEntity } from '../../domain/user.entity';
import { BadRequestDomainException } from 'apps/main-gateway/src/core/exceptions/domain-exceptions';
import {
	OAuthUserCreateModel,
	OauthUserInputModel,
} from '../../api/models/input/oauth.user.input';
import { v4 as uuidv4 } from 'uuid';

export class OAuthUserCreateCommand {
	constructor(public userData: OauthUserInputModel) {}
}

@CommandHandler(OAuthUserCreateCommand)
export class UserCreateUseCase implements ICommandHandler<OAuthUserCreateCommand> {
	constructor(
		@Inject(UserRepository.name) private readonly userRepository: UserRepository,
	) {}

	async execute(command: OAuthUserCreateCommand): Promise<string> {
		const userEmailIsExist = await this.userRepository.getByUsernameOrEmail(
			command.userData.email,
		);
		if (userEmailIsExist) {
			throw BadRequestDomainException.create('Email with this email already exist');
		}

		const username = `client ${uuidv4}`;
		const userCreateData: OAuthUserCreateModel = {
			...command.userData,
			username,
		};
		const newUser = UserEntity.createWithOAuth(userCreateData);

		const addedUser = await this.userRepository.createWithOAuth(newUser);
		console.log('User id = ', addedUser.id);

		return addedUser.id;
	}
}
