import { Injectable } from '@nestjs/common';
import { isCPF } from 'brazilian-values';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint()
export class IsValidCpfConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    return isCPF(value);
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'CPF must be valid';
  }
}

export function IsValidCpf(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidCpfConstraint,
    });
  };
}
