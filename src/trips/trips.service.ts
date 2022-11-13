import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/database';
import { StringUtils } from 'src/utils/stringUtils';
import { Trip } from './trip.entity';

@Injectable()
export class TripsService {
  constructor(private database: Database, private stringUtils: StringUtils) {}

  createTripRequest(tripInfo: Trip) {
    const newTrip = {
      ...tripInfo,
      status: 'CREATED',
      riderCpf: this.stringUtils.removeNonNumericCharacters(tripInfo.riderCpf),
    };
    this.database.saveTrip(newTrip);
    return newTrip;
  }

  findTripsNearMe() {
    const trips = this.database.findAllTrips();
    return trips.slice(0, 2);
  }
}
