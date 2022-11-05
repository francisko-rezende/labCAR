import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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
    return driver;
  }

  @Post()
  createDriver(@Body() driver: Driver) {
    this.service.saveDriver(driver);
    // todo return custom response
  }
}
