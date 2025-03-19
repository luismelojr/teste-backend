import { Provider } from '@nestjs/common';
import { CreateUser } from './create/create-user';
import { UpdateUser } from './update/update-user';
import { DeleteUser } from 'user/application/use-cases/delete/delete-user';
import { FindAllUser } from 'user/application/use-cases/find-all/find-all-user';
import {
  FindAutocompleteUser,
} from 'user/application/use-cases/find-autocomplete/find-autocomplete-user';
import {
  FindByUuidUser,
} from 'user/application/use-cases/find-by-uuid/find-by-uuid-user';
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
  AddUserGroupCognito,
} from 'user/application/use-cases/cognito/add-user-group-cognito';
import {
  RemoveUserGroupCognito,
} from 'user/application/use-cases/cognito/remove-user-group-cognito';
import {
  ListUserCognito,
} from 'user/application/use-cases/cognito/list-user-cognito';
import {
  ListUserGroupCognito,
} from 'user/application/use-cases/cognito/list-user-group-cognito';

export const cognitoUseCases: Provider[] = [
  RegisterUserCognito,
  UpdateUserCognito,
  DisableUserCognito,
  AddUserGroupCognito,
  RemoveUserGroupCognito,
  ListUserCognito,
  ListUserGroupCognito,
];

export const useCases: Provider[] = [
  ...cognitoUseCases,
  CreateUser,
  UpdateUser,
  DeleteUser,
  FindAllUser,
  FindByUuidUser,
  FindAutocompleteUser,
];


