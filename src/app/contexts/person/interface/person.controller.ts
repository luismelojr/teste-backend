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
import { CreatePerson } from '../application/use-cases/create/create-person';
import { CreatePersonInput } from './input/create-person.input';
import { UpdatePersonInput } from './input/update-person.input';
import { UpdatePerson } from '../application/use-cases/update/update-person';
import { UUID } from 'shared/types/uuid';
import {
  DeletePerson,
} from 'person/application/use-cases/delete/delete-person';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  FindAllPerson,
} from 'person/application/use-cases/find-all/find-all-person';
import {
  FindByUuidPerson,
} from 'person/application/use-cases/find-by-uuid/find-by-uuid-person';
import {
  FindAutocompletePerson,
} from 'person/application/use-cases/find-autocomplete/find-autocomplete-person';
import {
  FindAutocompletePersonOutput,
} from 'person/interface/output/find-autocomplete-person.output';

@ApiTags('persons')
@Controller('persons')
export class PersonController {
  constructor(
    private readonly createPerson: CreatePerson,
    private readonly updatePerson: UpdatePerson,
    private readonly deletePerson: DeletePerson,
    private readonly findAllPerson: FindAllPerson,
    private readonly findByUuidPerson: FindByUuidPerson,
    private readonly findAutocompletePerson: FindAutocompletePerson,
  ) {
  }

  @Post()
  async create(@Body() body: CreatePersonInput) {
    return await this.createPerson.execute(body);
  }

  @Put()
  async update(@Body() body: UpdatePersonInput) {
    return await this.updatePerson.execute(body);
  }

  @Delete('/:uuid')
  async remove(@Param('uuid') uuid: UUID) {
    await this.deletePerson.execute({ uuid });
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationInput,
    @Query('searchText') searchText?: string,
  ) {
    return await this.findAllPerson.execute({ pagination, searchText });
  }

  @Get('/autocomplete')
  async autocomplete(@Query('q') query: string): Promise<FindAutocompletePersonOutput[]> {
    return this.findAutocompletePerson.execute({ query });
  }

  @Get('/:uuid')
  async findOne(@Param('uuid') uuid: UUID) {
    return await this.findByUuidPerson.execute({ uuid });
  }


}
