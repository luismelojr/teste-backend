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
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { CreateCustomerInput } from './input/create-customer.input';
import { UpdateCustomerInput } from './input/update-customer.input';
import {
  CreateCustomer,
} from 'customer/application/use-cases/create/create-customer';
import {
  UpdateCustomer,
} from 'customer/application/use-cases/update/update-customer';
import {
  DeleteCustomer,
} from 'customer/application/use-cases/delete/delete-customer';
import {
  FindAllCustomer,
} from 'customer/application/use-cases/find-all/find-all-customer';
import {
  FindByUuidCustomer,
} from 'customer/application/use-cases/find-by-uuid/find-by-uuid-customer';
import {
  ApiCreateCustomer,
} from 'customer/interface/decorators/api-create-customer';
import { CustomerOutput } from 'customer/interface/output/customer.output';
import {
  ApiUpdateCustomer,
} from 'customer/interface/decorators/api-update-customer';
import {
  ApiFindByUuidCustomer,
} from 'customer/interface/decorators/api-find-by-uuid-customer';
import {
  ApiDeleteCustomer,
} from 'customer/interface/decorators/api-delete-customer';


@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createCustomer: CreateCustomer,
    private readonly updateCustomer: UpdateCustomer,
    private readonly deleteCustomer: DeleteCustomer,
    private readonly findAllCustomer: FindAllCustomer,
    private readonly findByUuidCustomer: FindByUuidCustomer,
  ) {
  }

  @Post()
  @ApiCreateCustomer()
  async create(@Body() body: CreateCustomerInput): Promise<CustomerOutput> {
    return await this.createCustomer.execute(body);
  }

  @Put()
  @ApiUpdateCustomer()
  async update(@Body() body: UpdateCustomerInput): Promise<CustomerOutput> {
    return await this.updateCustomer.execute(body);
  }

  @Delete('/:uuid')
  @ApiDeleteCustomer()
  async remove(@Param('uuid') uuid: UUID): Promise<void> {
    await this.deleteCustomer.execute({ uuid });
  }

  @Get()
  @ApiFindByUuidCustomer()
  async findAll(
    @Query() pagination: PaginationInput,
    @Query('searchText') searchText?: string,
  ) {
    return await this.findAllCustomer.execute({ pagination, searchText });
  }

  @Get('/:uuid')
  @ApiFindByUuidCustomer()
  async findOne(@Param('uuid') uuid: UUID): Promise<CustomerOutput> {
    return await this.findByUuidCustomer.execute({ uuid });
  }
}

