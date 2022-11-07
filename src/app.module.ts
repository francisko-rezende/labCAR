import { TransformResponseInterceptor } from 'src/core/http/transformResponseInterceptor';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DriversModule } from './drivers/drivers.module';
import { RidersModule } from './riders/riders.module';
import { TripsModule } from './trips/trips.module';

@Module({
  imports: [DriversModule, RidersModule, TripsModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
