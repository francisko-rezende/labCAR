import { CreateDriverDto } from './dto/createDriver.dto';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
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
import { DriversService } from './drivers.service';

@Controller('drivers')
export class DriversController {
  constructor(private service: DriversService) {}

  @Get()
  public findAllDrivers(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('startsWith') startsWith: string,
  ) {
    const drivers = this.service.findAllDrivers(page, size, startsWith);
    return drivers;
  }

  @Get(':cpf')
  public findOneDriver(@Param('cpf') cpf: string) {
    const driver = this.service.findOneDriver(cpf);
    if (!driver) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Driver not found',
      });
    }
    return driver;
  }

  @Post()
  public createDriver(@Body() driver: CreateDriverDto) {
    const newDriver = this.service.createDriver(driver);

    if (newDriver === 'conflict') {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'CPF must not have been used by other registered driver.',
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
  public updateDriver(
    @Param('cpf') cpf: string,
    @Body() driver: CreateDriverDto,
  ) {
    this.service.updateDriver(driver, cpf);

    return new NestResponseBuilder()
      .withStatus(HttpStatus.NO_CONTENT)
      .withHeaders({
        Location: `/drivers/${cpf}`,
      })
      .build();
  }

  @Patch(':cpf/toggle-block')
  public toggleBlock(
    @Param('cpf') cpf: string,
    @Body() body: { blockStatus: boolean },
  ) {
    const result = this.service.toggleBlock(cpf, body);

    if (result === 'not boolean') {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'blockStatus must be a boolean',
      });
    }

    if (result === 'not found') {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
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

  @Delete(':cpf')
  public removeDriver(@Param('cpf') cpf: string) {
    const result = this.service.removeDriver(cpf);

    if (result === 'not found') {
      throw new NotFoundException({
        error: 404,
        message: 'Driver not found',
      });
    }

    return new NestResponseBuilder().withStatus(HttpStatus.NO_CONTENT).build();
  }
}
