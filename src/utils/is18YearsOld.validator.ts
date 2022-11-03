import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isBefore, subYears } from 'date-fns';

@Injectable()
@ValidatorConstraint()
export class Is18YearsOldConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const birthDate = new Date(value);
    const today = new Date();
    const minDate = subYears(today, 18);
    const is18YearsOld = isBefore(birthDate, minDate);
    return is18YearsOld;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'User must be at least 18 years old';
  }
}

export function Is18YearsOld(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: Is18YearsOldConstraint,
    });
  };
}
