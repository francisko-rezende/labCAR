import { CpfHasntBeenUsedConstraint } from 'src/commons/decorators/hasCpfBeenUsedBefore.validator';
import { StringUtils } from 'src/utils/stringUtils';
import { Database } from 'src/database/database';
import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { Is18YearsOldConstraint } from 'src/commons/decorators/is18YearsOld.validator';

@Module({
  controllers: [DriversController],
  providers: [
    DriversService,
    Is18YearsOldConstraint,
    StringUtils,
    Database,
    CpfHasntBeenUsedConstraint,
  ],
})
export class DriversModule {}
