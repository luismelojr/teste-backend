import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query,
} from '@nestjs/common';
import {
  CreateCultivation
} from 'commons/cultivations/application/use-cases/create/create-cultivation';
import {
  DeleteCultivation
} from 'commons/cultivations/application/use-cases/delete/delete-cultivation';
import {
  FindAllCultivation
} from 'commons/cultivations/application/use-cases/find-all/find-all-cultivation';
import {
  FindAutocompleteCultivation
} from 'commons/cultivations/application/use-cases/find-autocomplete/find-autocomplete-cultivation';
import {
  FindByUuidCultivation
} from 'commons/cultivations/application/use-cases/find-by-uuid/find-by-uuid-cultivation';
import {
  UpdateCultivation
} from 'commons/cultivations/application/use-cases/update/update-cultivation';
import {
  CreateCultivationInput
} from 'commons/cultivations/interface/input/create-cultivation.input';
import {
  UpdateCultivationInput
} from 'commons/cultivations/interface/input/update-cultivation.input';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  FindAutocompleteCultivationOutput
} from 'commons/cultivations/interface/output/find-autocomplete-cultivation.output';

@ApiTags('cultivations')
@Controller('cultivations')
export class CultivationController {
  constructor(
    private readonly createCultivation: CreateCultivation,
    private readonly deleteCultivation: DeleteCultivation,
    private readonly findAllCultivation: FindAllCultivation,
    private readonly findAutoCompleteCultivation: FindAutocompleteCultivation,
    private readonly findByUuidCultivation: FindByUuidCultivation,
    private readonly updateCultivation: UpdateCultivation
  ) {
  }

  @Post()
  async create(@Body() body: CreateCultivationInput) {
    return await this.createCultivation.execute(body);
  }

  @Put()
  async update(@Body() body: UpdateCultivationInput) {
    return await this.updateCultivation.execute(body);
  }

  @Delete('/:uuid')
  async remove(@Param('uuid') uuid: UUID) {
    await this.deleteCultivation.execute({uuid});
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationInput,
    @Query('searchText') searchText?: string,
  ) {
    return await this.findAllCultivation.execute({pagination, searchText});
  }

  @Get('/autocomplete')
  async autocomplete(@Query('q') query: string): Promise<FindAutocompleteCultivationOutput[]> {
    return this.findAutoCompleteCultivation.execute({query});
  }

  @Get('/:uuid')
  async findOne(@Param('uuid') uuid: UUID) {
    return await this.findByUuidCultivation.execute({uuid});
  }
}
