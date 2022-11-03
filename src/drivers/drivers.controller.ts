import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

  @Post()
  createDriver(@Body() driver: Driver) {
    this.service.saveDriver(driver);
  }
}
