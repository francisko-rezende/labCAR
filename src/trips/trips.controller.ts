import { Controller, Get, Post, Body } from '@nestjs/common';
import { CurrentLocation } from './currentLocation.entity';
import { Trip } from './trip.entity';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post('request-trip')
  createTripRequest(@Body() tripInfo: Trip) {
    return this.tripsService.createTripRequest(tripInfo);
  }

  @Get('near-me')
  findTripsNearMe(@Body() currentLocation: CurrentLocation) {
    return this.tripsService.findTripsNearMe();
  }
}
