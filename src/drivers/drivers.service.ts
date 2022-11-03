import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/database';
import { Driver } from './driver.entity';

@Injectable()
export class DriversService {
  constructor(private database: Database) {}

  saveDrivers(drivers: Driver[]) {
    this.database.saveDrivers(drivers);
  }

  saveDriver(driver: Driver) {
    this.database.saveDriver(driver);
  }

  getDrivers() {
    const drivers = this.database.getDrivers();
    return drivers;
  }
}
