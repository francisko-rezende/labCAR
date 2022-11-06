import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { Database } from 'src/database/database';
import { StringUtils } from 'src/utils/stringUtils';

@Module({
  controllers: [TripsController],
  providers: [TripsService, Database, StringUtils],
})
export class TripsModule {}
