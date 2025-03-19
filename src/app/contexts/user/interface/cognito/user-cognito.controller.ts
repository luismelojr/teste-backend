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
import {
  RegisterUserCognito,
} from 'user/application/use-cases/cognito/register-user-cognito';
import {
  UpdateUserCognito,
} from 'user/application/use-cases/cognito/update-user-cognito';
import {
  DisableUserCognito,
} from 'user/application/use-cases/cognito/disable-user-cognito';
import {
  ListUserCognito,
} from 'user/application/use-cases/cognito/list-user-cognito';
import {
  AddUserGroupCognito,
} from 'user/application/use-cases/cognito/add-user-group-cognito';
import {
  RemoveUserGroupCognito,
} from 'user/application/use-cases/cognito/remove-user-group-cognito';
import {
  ListUserGroupCognito,
} from 'user/application/use-cases/cognito/list-user-group-cognito';
import {
  AddUserGroupInput,
} from 'user/interface/cognito/input/add-user-group.input';
import {
  RemoveUserGroupInput,
} from 'user/interface/cognito/input/remove-user-group.input';
import {
  ListUserGroupInput,
} from 'user/interface/cognito/input/list-user-group.input';
import {
  UpdateUserInput,
} from 'user/interface/cognito/input/update-user.input';
import {
  RegisterUserInput,
} from 'user/interface/cognito/input/register-user.input';

@Controller('users-cognito')
export class UserCognitoController {
  constructor(
    private readonly registerUserCognito: RegisterUserCognito,
    private readonly updateUserCognito: UpdateUserCognito,
    private readonly disableUserCognito: DisableUserCognito,
    private readonly listUserCognito: ListUserCognito,
    private readonly addUserGroupCognito: AddUserGroupCognito,
    private readonly removeUserGroupCognito: RemoveUserGroupCognito,
    private readonly listUserGroupCognito: ListUserGroupCognito,
  ) {
  }

  @Post()
  async registerUser(@Body() body: RegisterUserInput) {
    return this.registerUserCognito.execute(body);
  }

  @Put()
  async updateUser(@Body() body: UpdateUserInput) {
    return this.updateUserCognito.execute(body);
  }

  @Delete('/:cognitoId')
  async deleteUser(@Param('cognitoId') cognitoId: UUID) {
    return this.disableUserCognito.execute({ cognitoId });
  }

  @Get()
  async listUser(
    @Query('filter') filter?: string,
    @Query('limit') limit?: string,
    @Query('nextToken') nextToken?: string,
  ) {
    const limitNumber = parseInt(limit, 10) || 10;
    return this.listUserCognito.execute({
      filter, limit: limitNumber, nextToken,
    });
  }

  @Post('add-user-group')
  async addUserGroup(@Body() body: AddUserGroupInput) {
    await this.addUserGroupCognito.execute(body);
  }

  @Post('remove-user-group')
  async removeUserGroup(@Body() body: RemoveUserGroupInput) {
    await this.removeUserGroupCognito.execute(body);
  }

  @Get('list-user-groups')
  async listUserGroup(@Body() body: ListUserGroupInput) {
    return this.listUserGroupCognito.execute(body);
  }
}
