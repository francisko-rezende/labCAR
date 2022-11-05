import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';
import { Is18YearsOld } from 'src/commons/decorators/is18YearsOld.validator';

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
  cpf: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
