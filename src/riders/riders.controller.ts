import { StringUtils } from 'src/utils/stringUtils';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  ConflictException,
  NotFoundException,
  Query,
  Put,
} from '@nestjs/common';
import { RidersService } from './riders.service';
import { NestResponseBuilder } from 'src/core/http/nestResponseBuilder';
import { Rider } from './riders.entity';

@Controller('riders')
export class RidersController {
  constructor(
    private ridersService: RidersService,
    private stringUtils: StringUtils,
  ) {}

  @Post()
  createRider(@Body() rider: Rider) {
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
  findAllRiders(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('startsWith') startsWith: string,
  ) {
    const riders = this.ridersService.findAllRiders(page, size, startsWith);
    return riders;
  }

  @Get(':cpf')
  findOneRider(@Param('cpf') cpf: string) {
    const rider = this.ridersService.findOneRider(cpf);
    if (!rider) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Rider not found',
      });
    }
    return rider;
  }

  @Put(':cpf')
  public updateRider(@Param('cpf') cpf: string, @Body() rider: Rider) {
    const updatedRider = this.ridersService.updateRider(rider, cpf);
    const onlyDigitsCpf = this.stringUtils.removeNonNumericCharacters(
      rider.cpf,
    );

    if (updatedRider === 'not found') {
      throw new NotFoundException({
        error: 404,
        message: 'Rider not found',
      });
    }

    if (updatedRider === 'conflict') {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'CPF must not have been used by other registered rider.',
      });
    }

    return new NestResponseBuilder()
      .withStatus(HttpStatus.NO_CONTENT)
      .withHeaders({
        Location: `/riders/${onlyDigitsCpf}`,
      })
      .build();
  }

  @Delete(':cpf')
  removeRider(@Param('cpf') cpf: string) {
    const result = this.ridersService.removeRider(cpf);

    if (result === 'not found') {
      throw new NotFoundException({
        error: 404,
        message: 'Rider not found',
      });
    }

    return new NestResponseBuilder().withStatus(HttpStatus.NO_CONTENT).build();
  }
}
