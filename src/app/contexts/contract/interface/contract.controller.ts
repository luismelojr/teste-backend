import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateContract } from '../application/use-cases/create/create-contract';
import { CreateContractInput } from './input/create-contract.input';
import { FindAllContracts } from 'contract/application/use-cases/find-all/find-all-contracts';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { FindByUuidContract } from 'contract/application/use-cases/find-by-uuid/find-by-uuid-contract';

@ApiTags('contracts')
@Controller('contracts')
export class ContractController {
  constructor(
    private readonly createContract: CreateContract,
    private readonly findAllContract: FindAllContracts,
    private readonly findByUuidContract: FindByUuidContract,
  ) {}

  @Post()
  async create(@Body() body: CreateContractInput) {
    return await this.createContract.execute(body);
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationInput,
    @Query('searchText') searchText: string,
  ) {
    return await this.findAllContract.execute({ pagination, searchText });
  }

  @Get('/:uuid')
  async findOne(@Param('uuid') uuid: string) {
    return await this.findByUuidContract.execute({ uuid });
  }
}
