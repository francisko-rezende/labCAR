import { Injectable, NotFoundException } from '@nestjs/common';
import { Database } from 'src/database/database';
import { GetDriversResult } from 'src/types/getDriversResult';
import { StringUtils } from 'src/utils/stringUtils';
import { Driver } from './driver.entity';

@Injectable()
export class DriversService {
  constructor(private database: Database, private stringUtils: StringUtils) {}

  saveDrivers(drivers: Driver[]) {
    this.database.saveDrivers(drivers);
  }

  saveDriver(driver: Driver) {
    this.database.saveDriver(driver);
  }

  getDrivers(page: number, size: number, startingCharacters: string) {
    const allDrivers = this.database.getDrivers();
    const drivers = startingCharacters
      ? allDrivers.filter(({ name }) =>
          this.stringUtils
            .standardizeText(name)
            .startsWith(this.stringUtils.standardizeText(startingCharacters)),
        )
      : allDrivers;

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

  getDriver(cpf: string) {
    const drivers = this.database.getDrivers();
    const searchedDriver = drivers.find((driver) => driver.cpf === cpf);

    if (!searchedDriver) {
      throw new NotFoundException({
        error: 404,
        message: 'Driver not found',
      });
    }

    return searchedDriver;
  }
}
