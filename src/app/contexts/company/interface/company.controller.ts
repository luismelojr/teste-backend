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
import { CreateCompany } from '../application/use-cases/create/create-company';
import { CreateCompanyInput } from './input/create-company.input';
import { UpdateCompanyInput } from './input/update-company.input';
import { UpdateCompany } from '../application/use-cases/update/update-company';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  DeleteCompany,
} from 'company/application/use-cases/delete/delete-company';
import {
  FindAllCompany,
} from 'company/application/use-cases/find-all/find-all-company';
import {
  FindByUuidCompany,
} from 'company/application/use-cases/find-by-uuid/find-by-uuid-company';
import {
  FindAutocompleteCompany,
} from 'company/application/use-cases/find-autocomplete/find-autocomplete-company';
import {
  FindAutocompleteCompanyOutput,
} from 'company/interface/output/find-autocomplete-company.output';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly createCompany: CreateCompany,
    private readonly updateCompany: UpdateCompany,
    private readonly deleteCompany: DeleteCompany,
    private readonly findAllCompany: FindAllCompany,
    private readonly findByUuidCompany: FindByUuidCompany,
    private readonly findAutocompleteCompany: FindAutocompleteCompany,
  ) {
  }

  @Post()
  async create(@Body() body: CreateCompanyInput) {
    return await this.createCompany.execute(body);
  }

  @Put()
  async update(@Body() body: UpdateCompanyInput) {
    return await this.updateCompany.execute(body);
  }

  @Delete('/:uuid')
  async remove(@Param('uuid') uuid: UUID) {
    await this.deleteCompany.execute({ uuid });
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationInput,
    @Query('searchText') searchText?: string,
  ) {
    return await this.findAllCompany.execute({ pagination, searchText });
  }

  @Get('/autocomplete')
  async autocomplete(@Query('q') query: string): Promise<FindAutocompleteCompanyOutput[]> {
    return this.findAutocompleteCompany.execute({ query });
  }

  @Get('/:uuid')
  async findOne(@Param('uuid') uuid: UUID) {
    return await this.findByUuidCompany.execute({ uuid });
  }


}
