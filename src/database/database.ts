import { Driver } from 'src/drivers/driver.entity';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Rider } from 'src/riders/riders.entity';
import { Trip } from 'src/trips/trip.entity';

@Injectable()
export class Database {
  private DRIVERS = 'drivers.json';
  private RIDERS = 'riders.json';
  private TRIPS = 'trips.json';

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

  public findAllTrips() {
    const tripsInFile = fs.readFileSync(this.TRIPS).toString();
    const trips: Trip[] = JSON.parse(tripsInFile);
    return trips;
  }

  public createTrips(trips: Trip[]) {
    const stringfiedTrips = JSON.stringify(trips);
    fs.writeFileSync(this.TRIPS, stringfiedTrips);
  }

  public createTrip(trip: Trip) {
    const trips = this.findAllTrips();
    const updatedTrips = [...trips, trip];
    this.createTrips(updatedTrips);
  }
}
