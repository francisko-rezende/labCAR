import { MESSAGES } from 'src/consts/messages';
import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';
import { Is18YearsOld } from 'src/commons/decorators/is18YearsOld.validator';
import { IsValidCpf } from 'src/commons/decorators/isValidCpf.validators';

export class Driver {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsISO8601()
  @Is18YearsOld()
  birthDate: string;

  @IsNotEmpty()
  @IsString()
  @IsValidCpf({ message: MESSAGES.INVALID_CPF })
  cpf: string;

  @IsNotEmpty()
  @IsString()
  licensePlate: string;

  @IsNotEmpty()
  @IsString()
  carModel: string;
}
