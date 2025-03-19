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
import { CreateUser } from '../application/use-cases/create/create-user';
import { CreateUserInput } from './input/create-user.input';
import { UpdateUserInput } from './input/update-user.input';
import { UpdateUser } from '../application/use-cases/update/update-user';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { FindAllUser } from 'user/application/use-cases/find-all/find-all-user';
import {
  FindByUuidUser,
} from 'user/application/use-cases/find-by-uuid/find-by-uuid-user';
import {
  FindAutocompleteUser,
} from 'user/application/use-cases/find-autocomplete/find-autocomplete-user';
import {
  FindAutocompleteUserOutput,
} from 'user/interface/output/find-autocomplete-user.output';
import { DeleteUser } from 'user/application/use-cases/delete/delete-user';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly updateUser: UpdateUser,
    private readonly deleteUser: DeleteUser,
    private readonly findAllUser: FindAllUser,
    private readonly findByUuidUser: FindByUuidUser,
    private readonly findAutocompleteUser: FindAutocompleteUser,
  ) {
  }

  @Post()
  async create(@Body() body: CreateUserInput) {
    return await this.createUser.execute(body);
  }

  @Put()
  async update(@Body() body: UpdateUserInput) {
    return await this.updateUser.execute(body);
  }

  @Delete('/:uuid')
  async remove(@Param('uuid') uuid: UUID) {
    await this.deleteUser.execute({ uuid });
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationInput,
    @Query('searchText') searchText?: string,
  ) {
    return await this.findAllUser.execute({ pagination, searchText });
  }

  @Get('/autocomplete')
  async autocomplete(@Query('q') query: string): Promise<FindAutocompleteUserOutput[]> {
    return this.findAutocompleteUser.execute({ query });
  }

  @Get('/:uuid')
  async findOne(@Param('uuid') uuid: UUID) {
    return await this.findByUuidUser.execute({ uuid });
  }
}
