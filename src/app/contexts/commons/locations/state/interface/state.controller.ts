import { Controller, Get, Query } from '@nestjs/common';
import { StateService } from '../application/state.service';

@Controller('states')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get('/autocomplete')
  async autocomplete(@Query('q') query: string): Promise<string[]> {
    return this.stateService.findAll(query);
  }
}
