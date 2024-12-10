import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, Inject } from "@nestjs/common";
import bcrypt from 'bcrypt'
import { UserRepository } from "../../infrastructure/user.repository";
import { UserCreateModel, UserInputModel } from "../../api/models/input/user.input";
import { UserEntity } from "../../domain/user.entity";
import { BadRequestDomainException } from "apps/main-gateway/src/core/exceptions/domain-exceptions";

export class UserCreateCommand {
  constructor(public userData: UserInputModel,
  ) { }
}

@CommandHandler(UserCreateCommand)
export class UserCreateUseCase implements ICommandHandler<UserCreateCommand> {
  constructor(
    @Inject(UserRepository.name) private readonly userRepository: UserRepository,
  ) { }
  
  async execute(command: UserCreateCommand): Promise<string> {

    const userNameIsExist = await this.userRepository.getByUsernameOrEmail(command.userData.username)
    if (userNameIsExist) {
      throw BadRequestDomainException.create('Username with this login already exist')
    }

    const userEmailIsExist = await this.userRepository.getByUsernameOrEmail(command.userData.email)
    if (userEmailIsExist) {
      throw BadRequestDomainException.create('Email with this email already exist')
    }

    const passwordHash = await bcrypt.hash(command.userData.password, 10);
    const userCreateData: UserCreateModel = {
      ...command.userData,
      passwordHash
    }
    const newUser = new UserEntity(userCreateData);

    const addedUser = await this.userRepository.create(newUser);
    console.log('User id = ', addedUser.id)

    return addedUser.id
  }
}