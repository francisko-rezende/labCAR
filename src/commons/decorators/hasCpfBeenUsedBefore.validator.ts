import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Database } from 'src/database/database';
import { StringUtils } from 'src/utils/stringUtils';

@Injectable()
@ValidatorConstraint()
export class CpfHasntBeenUsedConstraint
  implements ValidatorConstraintInterface
{
  constructor(private database: Database, private stringUtils: StringUtils) {}

  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const drivers = this.database.getDrivers();
    const cpfDigits = this.stringUtils.removeNonNumericCharacters(value);

    const hasCpfBeenUsedByOtherDriver = drivers.some(
      ({ cpf }) => cpfDigits === cpf,
    );

    if (hasCpfBeenUsedByOtherDriver) {
      throw new ConflictException({
        message: 'CPF must not have been used by other registered user.',
      });
    }

    return !hasCpfBeenUsedByOtherDriver;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'CPF must not have been used by other registered user.';
  }
}

export function CpfHasntBeenUsed(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CpfHasntBeenUsedConstraint,
    });
  };
}
