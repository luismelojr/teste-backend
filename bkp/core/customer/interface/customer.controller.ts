import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateCustomer } from '../application/use-cases/create/create-customer';
import { UpdateCustomer } from '../application/use-cases/update/update-customer';
import { UUID } from 'shared/types/uuid';
import { DeleteCustomer } from '../application/use-cases/delete/delete-customer';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { FindAllCustomer } from '../application/use-cases/find-all/find-all-customer';
import { FindByUuidCustomer } from '../application/use-cases/find-by-uuid/find-by-uuid-customer';
import { FindAutocompleteCustomer } from '../application/use-cases/find-autocomplete/find-autocomplete-customer';
import { CreateCustomerInput } from './input/create-customer.input';
import { UpdateCustomerInput } from './input/update-customer.input';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createCustomer: CreateCustomer,
    private readonly updateCustomer: UpdateCustomer,
    private readonly deleteCustomer: DeleteCustomer,
    private readonly findAllCustomer: FindAllCustomer,
    private readonly findByUuidCustomer: FindByUuidCustomer,
    private readonly findAutocompleteCustomer: FindAutocompleteCustomer,
  ) {}

  @Post()
  async create(@Body() body: CreateCustomerInput) {
    return await this.createCustomer.execute(body);
  }

  @Put()
  async update(@Body() body: UpdateCustomerInput) {
    return await this.updateCustomer.execute(body);
  }

  @Delete('/:uuid')
  async remove(@Param('uuid') uuid: UUID) {
    await this.deleteCustomer.execute({ uuid });
  }

  @Get()
  async findAll(@Query() pagination: PaginationInput, @Query('searchText') searchText?: string) {
    return await this.findAllCustomer.execute({ pagination, searchText });
  }

  @Get('/autocomplete')
  async autocomplete(@Query('q') query: string) {
    return this.findAutocompleteCustomer.execute({ query });
  }

  @Get('/:uuid')
  async findOne(@Param('uuid') uuid: UUID) {
    return await this.findByUuidCustomer.execute({ uuid });
  }
}
