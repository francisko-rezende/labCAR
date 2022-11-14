import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Is18YearsOld } from 'src/commons/decorators/is18YearsOld.validator';
import { IsValidCpf } from 'src/commons/decorators/isValidCpf.validators';
import { MESSAGES } from 'src/consts/messages';

export class Rider {
  @ApiProperty({ example: 'Nenê Silva' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: '1980-11-03' })
  @IsNotEmpty()
  @IsISO8601()
  @Is18YearsOld()
  birthDate: string;

  @ApiProperty({ example: '28032629165' })
  @IsNotEmpty()
  @IsString()
  @IsValidCpf({ message: MESSAGES.INVALID_CPF })
  cpf: string;

  @ApiProperty({ example: 'R. da Liberdade, 829' })
  @IsNotEmpty()
  @IsString()
  address: string;
}
