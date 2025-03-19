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
import { DeletePlan } from 'plan/application/use-cases/delete/delete-plan';
import {
  FindAllPlan,
} from 'plan/application/use-cases/find-all/find-all-plan';
import {
  FindByUuidPlan,
} from 'plan/application/use-cases/find-by-uuid/find-by-uuid-plan';
import {
  FindAutocompletePlan,
} from 'plan/application/use-cases/find-autocomplete/find-autocomplete-plan';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { CreatePlanInput } from './input/create-plan.input';
import { UpdatePlanInput } from './input/update-plan.input';
import { CreatePlan } from '../application/use-cases/create/create-plan';
import { UpdatePlan } from '../application/use-cases/update/update-plan';
import {
  FindAutocompletePlanOutput,
} from 'plan/interface/output/find-autocomplete-plan.output';


@ApiTags('plans')
@Controller('plans')
export class PlanController {
  constructor(
    private readonly createPlan: CreatePlan,
    private readonly updatePlan: UpdatePlan,
    private readonly deletePlan: DeletePlan,
    private readonly findAllPlan: FindAllPlan,
    private readonly findByUuidPlan: FindByUuidPlan,
    private readonly findAutocompletePlan: FindAutocompletePlan,
  ) {
  }

  @Post()
  async create(@Body() body: CreatePlanInput) {
    return await this.createPlan.execute(body);
  }

  @Put()
  async update(@Body() body: UpdatePlanInput) {
    return await this.updatePlan.execute(body);
  }

  @Delete('/:uuid')
  async remove(@Param('uuid') uuid: UUID) {
    await this.deletePlan.execute({ uuid });
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationInput,
    @Query('searchText') searchText?: string,
  ) {
    return await this.findAllPlan.execute({ pagination, searchText });
  }

  @Get('/autocomplete')
  async autocomplete(@Query('q') query: string): Promise<FindAutocompletePlanOutput[]> {
    return this.findAutocompletePlan.execute({ query });
  }

  @Get('/:uuid')
  async findOne(@Param('uuid') uuid: UUID) {
    return await this.findByUuidPlan.execute({ uuid });
  }
}

