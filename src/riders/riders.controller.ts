import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RidersService } from './riders.service';
import { NestResponseBuilder } from 'src/core/http/nestResponseBuilder';
import { Rider } from './riders.entity';

@Controller('riders')
export class RidersController {
  constructor(private readonly ridersService: RidersService) {}

  @Post()
  create(@Body() rider: Rider) {
    const newRider = this.ridersService.createRider(rider);

    if (newRider === 'conflict') {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'CPF must not have been used by other registered rider.',
      });
    }

    return new NestResponseBuilder()
      .withStatus(HttpStatus.CREATED)
      .withHeaders({
        Location: `/riders/${newRider.cpf}`,
      })
      .withBody(newRider)
      .build();
  }

  @Get()
  findAllRiders() {
    return this.ridersService.findAllRiders();
  }

  @Get(':cpf')
  findOne(@Param('cpf') cpf: string) {
    const rider = this.ridersService.findOneRider(cpf);
    if (!rider) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Rider not found',
      });
    }
    return rider;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRiderDto: UpdateRiderDto) {
  //   return this.ridersService.update(+id, updateRiderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ridersService.remove(+id);
  // }
}
