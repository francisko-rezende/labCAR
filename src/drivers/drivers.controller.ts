import { Controller, Get } from '@nestjs/common';

@Controller('drivers')
export class DriversController {
  @Get()
  findAll() {
    console.log('All drivers');
  }
}
