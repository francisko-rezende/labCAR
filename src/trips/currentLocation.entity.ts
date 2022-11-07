import { IsNotEmpty, IsString } from 'class-validator';

export class CurrentLocation {
  @IsNotEmpty()
  @IsString()
  address: string;
}
