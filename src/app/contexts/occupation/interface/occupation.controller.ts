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
  DeleteOccupation,
} from '../application/use-cases/delete/delete-occupation';
import {
  FindAllOccupation,
} from '../application/use-cases/find-all/find-all-occupation';
import {
  FindByUuidOccupation,
} from '../application/use-cases/find-by-uuid/find-by-uuid-occupation';
import {
  FindAutocompleteOccupation,
} from '../application/use-cases/find-autocomplete/find-autocomplete-occupation';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { CreateOccupationInput } from './input/create-occupation.input';
import { UpdateOccupationInput } from './input/update-occupation.input';
import {
  CreateOccupation,
} from '../application/use-cases/create/create-occupation';
import {
  UpdateOccupation,
} from '../application/use-cases/update/update-occupation';
import {
  FindAutocompleteOccupationOutput,
} from './output/find-autocomplete-occupation.output';


@ApiTags('occupations')
@Controller('occupations')
export class OccupationController {
  constructor(
    private readonly createOccupation: CreateOccupation,
    private readonly updateOccupation: UpdateOccupation,
    private readonly deleteOccupation: DeleteOccupation,
    private readonly findAllOccupation: FindAllOccupation,
    private readonly findByUuidOccupation: FindByUuidOccupation,
    private readonly findAutocompleteOccupation: FindAutocompleteOccupation,
  ) {
  }

  @Post()
  async create(@Body() body: CreateOccupationInput) {
    return await this.createOccupation.execute(body);
  }

  @Put()
  async update(@Body() body: UpdateOccupationInput) {
    return await this.updateOccupation.execute(body);
  }

  @Delete('/:uuid')
  async remove(@Param('uuid') uuid: UUID) {
    await this.deleteOccupation.execute({ uuid });
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationInput,
    @Query('searchText') searchText?: string,
  ) {
    return await this.findAllOccupation.execute({ pagination, searchText });
  }

  @Get('/autocomplete')
  async autocomplete(@Query('q') query: string): Promise<FindAutocompleteOccupationOutput[]> {
    return this.findAutocompleteOccupation.execute({ query });
  }

  @Get('/:uuid')
  async findOne(@Param('uuid') uuid: UUID) {
    return await this.findByUuidOccupation.execute({ uuid });
  }
}

