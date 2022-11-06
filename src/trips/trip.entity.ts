import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidCpf } from 'src/commons/decorators/isValidCpf.validators';
import { MESSAGES } from 'src/consts/messages';

export class Trip {
  @IsNotEmpty()
  @IsString()
  @IsValidCpf({ message: MESSAGES.INVALID_CPF })
  riderCpf: string;

  @IsNotEmpty()
  @IsString()
  origin: string;

  @IsNotEmpty()
  @IsString()
  detination: string;
}
