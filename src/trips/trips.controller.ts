import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentLocation } from './currentLocation.entity';
import { Trip } from './trip.entity';
import { TripsService } from './trips.service';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @ApiCreatedResponse({ type: Trip })
  @Post('request-trip')
  createTripRequest(@Body() tripInfo: Trip) {
    return this.tripsService.createTripRequest(tripInfo);
  }

  @Get('near-me')
  findTripsNearMe(@Body() currentLocation: CurrentLocation) {
    return this.tripsService.findTripsNearMe();
  }
}
