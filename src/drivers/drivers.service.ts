import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/database';
import { GetDriversResult } from 'src/types/getDriversResult';
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

  getDrivers(page: number, size: number, starsWith: string) {
    const drivers = this.database.getDrivers();

    const startIndex = (Number(page) - 1) * Number(size);
    const endIndex = startIndex + Number(size);

    const result: GetDriversResult = {
      data: drivers.slice(startIndex, endIndex),
    };

    if (startIndex > 0) {
      result.previous = {
        page: Number(page) - 1,
        size: size,
      };
    }

    if (endIndex < drivers.length) {
      result.next = {
        page: Number(page) + 1,
        size: size,
      };
    }

    return result;
  }
}
