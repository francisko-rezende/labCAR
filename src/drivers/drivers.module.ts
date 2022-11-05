import { Database } from 'src/database/database';
import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { Is18YearsOldConstraint } from 'src/commons/decorators/is18YearsOld.validator';

@Module({
  controllers: [DriversController],
  providers: [DriversService, Database, Is18YearsOldConstraint],
})
export class DriversModule {}
