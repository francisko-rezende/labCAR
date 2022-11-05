import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { NestResponseBuilder } from 'src/core/http/nestResponseBuilder';
import { Driver } from './driver.entity';
import { DriversService } from './drivers.service';

@Controller('drivers')
export class DriversController {
  constructor(private service: DriversService) {}

  @Get()
  getDrivers(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('startsWith') startsWith: string,
  ) {
    const drivers = this.service.getDrivers(page, size, startsWith);
    return drivers;
  }

  @Get(':cpf')
  getDriver(@Param('cpf') cpf: string) {
    const driver = this.service.getDriver(cpf);
    if (!driver) {
      throw new NotFoundException({
        error: HttpStatus.NOT_FOUND,
        message: 'Driver not found',
      });
    }
  }

  @Post()
  createDriver(@Body() driver: Driver) {
    const newDriver = this.service.saveDriver(driver);

    if (newDriver === 'conflict') {
      throw new ConflictException({
        error: HttpStatus.CONFLICT,
        message: 'CPF must not have been used by other registered user.',
      });
    }

    return new NestResponseBuilder()
      .withStatus(HttpStatus.CREATED)
      .withHeaders({
        Location: `/drivers/${newDriver.cpf}`,
      })
      .withBody(newDriver)
      .build();
  }

  @Put(':cpf')
  public updateDriver(@Param('cpf') cpf: string, @Body() driver: Driver) {
    this.service.updateDriver(driver, cpf);

    return new NestResponseBuilder()
      .withStatus(HttpStatus.NO_CONTENT)
      .withHeaders({
        Location: `/drivers/${cpf}`,
      })
      .build();
  }

  @Patch(':cpf/toggle-block')
  public toggleBlock(@Param('cpf') cpf: string) {
    const result = this.service.toggleBlock(cpf);

    if (result === 'not found') {
      throw new NotFoundException({
        error: 404,
        message: 'Driver not found',
      });
    }

    return new NestResponseBuilder()
      .withStatus(HttpStatus.NO_CONTENT)
      .withHeaders({
        Location: `/drivers/${cpf}`,
      })
      .build();
  }
}
