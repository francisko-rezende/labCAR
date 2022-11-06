import { TransformResponseInterceptor } from 'src/core/http/transformResponseInterceptor';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DriversModule } from './drivers/drivers.module';

@Module({
  imports: [DriversModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
