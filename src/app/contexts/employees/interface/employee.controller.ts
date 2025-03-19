import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post, Put,
  Query,
} from '@nestjs/common';
import {
  CreateEmployee
} from '../application/use-cases/create/create-employee';
import { CreateEmployeeInput } from './input/create-employee.input';
import { UUID } from 'shared/types/uuid';
import {
  DeleteEmployee
} from '../application/use-cases/delete/delete-employee';
import {
  FindAllEmployee
} from '../application/use-cases/find-all/find-all-employee';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  FindAutocompleteEmployee
} from '../application/use-cases/find-autocomplete/find-autocomplete-employee';
import {
  FindAutoCompleteEmployeeOutput
} from './output/FindAutoCompleteEmployee.output';
import { UpdateEmployeeInput } from './input/update-employee.input';
import {
  UpdateEmployee
} from '../application/use-cases/update/update-employee';
import {
  FindOneByUuidEmployee
} from '../application/use-cases/find-by-uuid/find-by-uuid-employee';

@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly createEmployee: CreateEmployee,
    private readonly deleteEmployee: DeleteEmployee,
    private readonly findAllEmployee: FindAllEmployee,
    private readonly findAutoCompleteEmployee: FindAutocompleteEmployee,
    private readonly updateEmployee: UpdateEmployee,
    private readonly findByUuidEmployee: FindOneByUuidEmployee
  ) {
  }

  @Post()
  async create(@Body() body: CreateEmployeeInput) {
    return this.createEmployee.execute(body);
  }

  @Delete('/:uuid')
  async delete(@Param('uuid') uuid: UUID) {
    await this.deleteEmployee.execute({uuid});
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationInput,
    @Query('searchText') searchText?: string,
  ) {
    return await this.findAllEmployee.execute({pagination, searchText});
  }

  @Get('/autocomplete')
  async autocomplete(@Query('q') query: string): Promise<FindAutoCompleteEmployeeOutput[]> {
    return this.findAutoCompleteEmployee.execute({query});
  }

  @Put()
  async update(@Body() body: UpdateEmployeeInput) {
    return this.updateEmployee.execute(body);
  }

  @Get('/:uuid')
  async findOne(@Param('uuid') uuid: UUID) {
    return await this.findByUuidEmployee.execute({uuid});
  }
}
