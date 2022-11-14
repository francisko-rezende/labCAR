import { MESSAGES } from 'src/consts/messages';
import { IsISO8601, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Is18YearsOld } from 'src/commons/decorators/is18YearsOld.validator';
import { IsValidCpf } from 'src/commons/decorators/isValidCpf.validators';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty({ example: 'Agostinho Carrara' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: '1980-11-03' })
  @IsNotEmpty()
  @IsISO8601()
  @Is18YearsOld()
  birthDate: string;

  @ApiResponseProperty({ example: '39966283153' })
  @IsNotEmpty()
  @IsString()
  @IsValidCpf({ message: MESSAGES.INVALID_CPF })
  cpf: string;

  @ApiProperty({ example: 'MNO-234' })
  @IsNotEmpty()
  @IsString()
  licensePlate: string;

  @ApiProperty({ example: 'Santana' })
  @IsNotEmpty()
  @IsString()
  carModel: string;
}
