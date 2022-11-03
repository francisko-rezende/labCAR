import { DriversController } from './drivers/drivers.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [DriversController],
  providers: [],
})
export class AppModule {}
