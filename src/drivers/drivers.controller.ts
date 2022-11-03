import { Body, Controller, Get, Post } from '@nestjs/common';
import { Database } from 'src/database/database';
import { Driver } from './driver.entity';

@Controller('drivers')
export class DriversController {
  constructor(private database: Database) {}

  @Get()
  findAll() {
    console.log('All drivers');
  }

  @Post()
  createDriver(@Body() driver: Driver) {
    this.database.saveDriver(driver);
  }
}
