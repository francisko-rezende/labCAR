import { Module } from '@nestjs/common';
import { RidersService } from './riders.service';
import { RidersController } from './riders.controller';
import { Database } from 'src/database/database';
import { StringUtils } from 'src/utils/stringUtils';

@Module({
  controllers: [RidersController],
  providers: [RidersService, Database, StringUtils],
})
export class RidersModule {}
