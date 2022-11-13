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

  public findAllDrivers(): Driver[] {
    const driversInFile = fs.readFileSync(this.DRIVERS).toString();
    const drivers: Driver[] = JSON.parse(driversInFile);
    return drivers;
  }

  public saveDrivers(drivers: Driver[]) {
    const stringifiedDrivers = JSON.stringify(drivers);
    fs.writeFileSync(this.DRIVERS, stringifiedDrivers);
  }

  public saveDriver(driver: Driver) {
    const drivers = this.findAllDrivers();
    const updatedDrivers = [...drivers, driver];
    this.saveDrivers(updatedDrivers);
  }

  public findAllRiders() {
    const ridersInFile = fs.readFileSync(this.RIDERS).toString();
    const riders = JSON.parse(ridersInFile);
    return riders;
  }

  public saveRiders(riders: Rider[]) {
    const stringifiedRiders = JSON.stringify(riders);
    fs.writeFileSync(this.RIDERS, stringifiedRiders);
  }

  public saveRider(rider: Rider) {
    const riders = this.findAllRiders();
    const updatedRiders = [...riders, rider];
    this.saveRiders(updatedRiders);
  }

  public findAllTrips() {
    const tripsInFile = fs.readFileSync(this.TRIPS).toString();
    const trips: Trip[] = JSON.parse(tripsInFile);
    return trips;
  }

  public saveTrips(trips: Trip[]) {
    const stringfiedTrips = JSON.stringify(trips);
    fs.writeFileSync(this.TRIPS, stringfiedTrips);
  }

  public saveTrip(trip: Trip) {
    const trips = this.findAllTrips();
    const updatedTrips = [...trips, trip];
    this.saveTrips(updatedTrips);
  }
}
