/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */
import { Inject, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepository } from '../../../features/user/infrastructure/user.repository';

export function EmailIsConfirmed(property?: string, validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: EmailIsConfirmedConstraint,
    });
  };
}

// Обязательна регистрация в ioc
@ValidatorConstraint({ name: 'EmailIsConfirmed', async: false })
@Injectable()
export class EmailIsConfirmedConstraint implements ValidatorConstraintInterface {
  constructor(@Inject(UserRepository.name) private readonly userRepository: UserRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const targerUser = await this.userRepository.getByUsernameOrEmail(value);
    if (!targerUser || targerUser.isConfirmed) return false;
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'email is already confirmed';
  }
}