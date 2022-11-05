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
    const newDriver = {
      ...driver,
      cpf: this.stringUtils.removeNonNumericCharacters(driver.cpf),
      isBlocked: false,
      isDeleted: false,
    };

    const drivers = this.database.getDrivers();
    const hasCpfBeenRegistered = drivers.some(
      ({ cpf }) => cpf === newDriver.cpf,
    );

    if (hasCpfBeenRegistered) {
      return 'conflict';
    }

    this.database.saveDriver(newDriver);
    return newDriver;
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
    const onlyDigitsCpf = this.stringUtils.removeNonNumericCharacters(cpf);
    const searchedDriver = drivers.find(({ cpf }) => cpf === onlyDigitsCpf);

    return searchedDriver;
  }

  updateDriver(driverInfo: Driver, cpf: string) {
    const drivers = this.database.getDrivers();
    const onlyDigitsCpf = this.stringUtils.removeNonNumericCharacters(cpf);
    const checkIfMatchingCpf = (driver) => driver.cpf === onlyDigitsCpf;

    const isDriverRegistered = drivers.some(checkIfMatchingCpf);

    if (!isDriverRegistered) {
      throw new NotFoundException({
        error: 404,
        message: 'Driver not found',
      });
    }

    const updatedDrivers = drivers.map((driver) => {
      const isDriverToUpdate = checkIfMatchingCpf(driver);

      return isDriverToUpdate
        ? {
            ...driverInfo,
            cpf: onlyDigitsCpf,
          }
        : driver;
    });

    this.database.saveDrivers(updatedDrivers);
  }

  toggleBlock(cpf: string) {
    const drivers = this.database.getDrivers();
    const onlyDigitsCpf = this.stringUtils.removeNonNumericCharacters(cpf);
    const checkIfMatchingCpf = (driver) => driver.cpf === onlyDigitsCpf;

    const isDriverRegistered = drivers.some(checkIfMatchingCpf);

    if (!isDriverRegistered) {
      return 'not found';
    }

    const updatedDrivers = drivers.map((driver) => {
      const isDriverToUpdate = checkIfMatchingCpf(driver);

      return isDriverToUpdate
        ? {
            ...driver,
            isBlocked: !driver.isBlocked,
          }
        : driver;
    });

    this.database.saveDrivers(updatedDrivers);
  }
}
