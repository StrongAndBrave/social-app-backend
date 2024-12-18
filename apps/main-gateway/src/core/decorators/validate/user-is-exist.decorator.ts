import { Inject, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepository } from '../../../features/user/infrastructure/user.repository';

export function NameIsExist(property?: string, validationOptions?: ValidationOptions) {
  
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: NameIsExistConstraint,
    });
  };
}

// Обязательна регистрация в ioc
@ValidatorConstraint({ name: 'NameIsExist', async: false })
@Injectable()
export class NameIsExistConstraint implements ValidatorConstraintInterface {
  constructor(@Inject(UserRepository.name) private readonly userRepository: UserRepository) {}

  async validate(value: any, args: ValidationArguments) {
    const nameIsExist = await this.userRepository.getByUsernameOrEmail(value);

    return !!!nameIsExist;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Name or email already exist';
  }
}