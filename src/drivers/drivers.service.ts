import { Injectable, NotFoundException } from '@nestjs/common';
import { Database } from 'src/database/database';
import { FindAllDriversResult } from 'src/types/findAllDriversResult';
import { StringUtils } from 'src/utils/stringUtils';
import { Driver } from './driver.entity';
import { CreateDriverDto } from './dto/createDriver.dto';

@Injectable()
export class DriversService {
  constructor(private database: Database, private stringUtils: StringUtils) {}

  saveDrivers(drivers: Driver[]) {
    this.database.saveDrivers(drivers);
  }

  createDriver(driver: CreateDriverDto): 'conflict' | Driver {
    const newDriver: Driver = {
      ...driver,
      cpf: this.stringUtils.removeNonNumericCharacters(driver.cpf),
      isBlocked: false,
    };

    const drivers = this.database.findAllDrivers();
    const hasCpfBeenRegistered = drivers.some(
      ({ cpf }) => cpf === newDriver.cpf,
    );

    if (hasCpfBeenRegistered) {
      return 'conflict';
    }

    this.database.saveDriver(newDriver);
    return newDriver;
  }

  findAllDrivers(
    page: number,
    size: number,
    startingCharacters: string,
  ): FindAllDriversResult {
    const allDrivers = this.database.findAllDrivers();
    const drivers = startingCharacters
      ? allDrivers.filter(({ name }) =>
          this.stringUtils
            .standardizeText(name)
            .startsWith(this.stringUtils.standardizeText(startingCharacters)),
        )
      : allDrivers;

    const startIndex = (Number(page) - 1) * Number(size);
    const endIndex = startIndex + Number(size);

    const result: FindAllDriversResult = {
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
    const drivers = this.database.findAllDrivers();
    const onlyDigitsCpf = this.stringUtils.removeNonNumericCharacters(cpf);
    const searchedDriver = drivers.find(({ cpf }) => cpf === onlyDigitsCpf);

    return searchedDriver;
  }

  updateDriver(driverInfo: Driver, cpf: string) {
    const drivers = this.database.findAllDrivers();
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
        ? { ...driver, ...driverInfo, cpf: onlyDigitsCpf }
        : driver;
    });

    this.database.saveDrivers(updatedDrivers);
  }

  toggleBlock(cpf: string, body: { blockStatus: boolean }) {
    if (typeof body.blockStatus !== 'boolean') return 'not boolean';

    const drivers = this.database.findAllDrivers();
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
            isBlocked: body.blockStatus,
          }
        : driver;
    });

    this.database.saveDrivers(updatedDrivers);
  }

  removeDriver(cpf: string) {
    const drivers = this.database.findAllDrivers();
    const onlyDigitsCpf = this.stringUtils.removeNonNumericCharacters(cpf);
    const checkIfMatchingCpf = (driver) => driver.cpf === onlyDigitsCpf;

    const isDriverRegistered = drivers.some(checkIfMatchingCpf);

    if (!isDriverRegistered) {
      return 'not found';
    }

    const updatedDrivers = drivers.filter(
      (driver) => !checkIfMatchingCpf(driver),
    );

    this.database.saveDrivers(updatedDrivers);
  }
}
