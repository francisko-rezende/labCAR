import { Driver } from './../drivers/driver.entity';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class Database {
  private DRIVERS = 'drivers.json';

  public getDrivers(): Driver[] {
    const driversInFile = fs.readFileSync(this.DRIVERS).toString();
    const drivers = JSON.parse(driversInFile);
    return drivers;
  }

  public saveDrivers(drivers: Driver[]) {
    const stringifiedDrivers = JSON.stringify(drivers);
    fs.writeFileSync(this.DRIVERS, stringifiedDrivers);
  }

  public saveDriver(driver: Driver) {
    const drivers = this.getDrivers();
    const updatedBeers = [...drivers, driver];
    this.saveDrivers(updatedBeers);
  }
}
