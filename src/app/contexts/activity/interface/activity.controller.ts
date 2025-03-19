import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  DeleteActivity,
} from 'activity/application/use-cases/delete/delete-activity';
import {
  FindAllActivity,
} from 'activity/application/use-cases/find-all/find-all-activity';
import {
  FindByUuidActivity,
} from 'activity/application/use-cases/find-by-uuid/find-by-uuid-activity';
import {
  FindAutocompleteActivity,
} from 'activity/application/use-cases/find-autocomplete/find-autocomplete-activity';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { CreateActivityInput } from './input/create-activity.input';
import { UpdateActivityInput } from './input/update-activity.input';
import {
  CreateActivity,
} from '../application/use-cases/create/create-activity';
import {
  UpdateActivity,
} from '../application/use-cases/update/update-activity';
import {
  FindAutocompleteActivityOutput,
} from 'activity/interface/output/find-autocomplete-activity.output';


@ApiTags('activities')
@Controller('activities')
export class ActivityController {
  constructor(
    private readonly createActivity: CreateActivity,
    private readonly updateActivity: UpdateActivity,
    private readonly deleteActivity: DeleteActivity,
    private readonly findAllActivity: FindAllActivity,
    private readonly findByUuidActivity: FindByUuidActivity,
    private readonly findAutocompleteActivity: FindAutocompleteActivity,
  ) {
  }

  @Post()
  async create(@Body() body: CreateActivityInput) {
    return await this.createActivity.execute(body);
  }

  @Put()
  async update(@Body() body: UpdateActivityInput) {
    return await this.updateActivity.execute(body);
  }

  @Delete('/:uuid')
  async remove(@Param('uuid') uuid: UUID) {
    await this.deleteActivity.execute({ uuid });
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationInput,
    @Query('searchText') searchText?: string,
  ) {
    return await this.findAllActivity.execute({ pagination, searchText });
  }

  @Get('/autocomplete')
  async autocomplete(@Query('q') query: string): Promise<FindAutocompleteActivityOutput[]> {
    return this.findAutocompleteActivity.execute({ query });
  }

  @Get('/:uuid')
  async findOne(@Param('uuid') uuid: UUID) {
    return await this.findByUuidActivity.execute({ uuid });
  }
}

