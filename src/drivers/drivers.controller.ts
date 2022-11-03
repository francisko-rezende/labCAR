import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Driver } from './driver.entity';
import { DriversService } from './drivers.service';

@Controller('drivers')
export class DriversController {
  constructor(private service: DriversService) {}

  @Get()
  getDrivers(
    @Param('page') page = 1,
    @Param('size') size = 10,
    @Param('startsWith') startsWith: string,
  ) {
    const drivers = this.service.getDrivers();
    return drivers;
  }

  @Post()
  createDriver(@Body() driver: Driver) {
    this.service.saveDriver(driver);
  }
}
