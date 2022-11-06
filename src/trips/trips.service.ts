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
    this.database.createTrip(newTrip);
    return newTrip;
  }
  // create(createTripDto: CreateTripDto) {
  //   return 'This action adds a new trip';
  // }
  // findAll() {
  //   return `This action returns all trips`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} trip`;
  // }
  // update(id: number, updateTripDto: UpdateTripDto) {
  //   return `This action updates a #${id} trip`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} trip`;
  // }
}
