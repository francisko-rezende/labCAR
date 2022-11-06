import { Driver } from 'src/drivers/driver.entity';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Rider } from 'src/riders/riders.entity';

@Injectable()
export class Database {
  private DRIVERS = 'drivers.json';
  private RIDERS = 'riders.json';

  public getDrivers() {
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
    const updatedDrivers = [...drivers, driver];
    this.saveDrivers(updatedDrivers);
  }

  public findAllRiders() {
    const ridersInFile = fs.readFileSync(this.RIDERS).toString();
    const riders = JSON.parse(ridersInFile);
    return riders;
  }

  public createRiders(riders: Rider[]) {
    const stringifiedRiders = JSON.stringify(riders);
    fs.writeFileSync(this.RIDERS, stringifiedRiders);
  }

  public createRider(rider: Rider) {
    const riders = this.findAllRiders();
    const updatedRiders = [...riders, rider];
    this.createRiders(updatedRiders);
  }
}
