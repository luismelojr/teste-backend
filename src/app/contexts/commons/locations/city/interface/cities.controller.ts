import { Controller, Get, Query } from '@nestjs/common';
import { CityService } from '../application/city.service';

@Controller('cities')
export class CitiesController {
  constructor(private readonly cityService: CityService) {}

  @Get('/autocomplete')
  async autocomplete(@Query('q') query: string): Promise<string[]> {
    return this.cityService.findAll(query);
  }
}
