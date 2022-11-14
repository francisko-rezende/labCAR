import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidCpf } from 'src/commons/decorators/isValidCpf.validators';
import { MESSAGES } from 'src/consts/messages';

export class Trip {
  @ApiProperty({ example: '337.569.221-89' })
  @IsNotEmpty()
  @IsString()
  @IsValidCpf({ message: MESSAGES.INVALID_CPF })
  riderCpf: string;

  @ApiProperty({ example: 'Rua dos bobos, numero 0' })
  @IsNotEmpty()
  @IsString()
  origin: string;

  @ApiProperty({ example: 'Rus Juiz de Fora' })
  @IsNotEmpty()
  @IsString()
  destination: string;
}
