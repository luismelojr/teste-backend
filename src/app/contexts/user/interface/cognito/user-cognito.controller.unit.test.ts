import { Test, TestingModule } from '@nestjs/testing';
import {
  RegisterUserCognito,
} from 'user/application/use-cases/cognito/register-user-cognito';
import {
  AddUserGroupCognito,
} from 'user/application/use-cases/cognito/add-user-group-cognito';
import {
  RemoveUserGroupCognito,
} from 'user/application/use-cases/cognito/remove-user-group-cognito';
import {
  ListUserGroupCognito,
} from 'user/application/use-cases/cognito/list-user-group-cognito';
import { RegisterUserInput } from './input/register-user.input';
import { AddUserGroupInput } from './input/add-user-group.input';
import { RemoveUserGroupInput } from './input/remove-user-group.input';
import { ListUserGroupInput } from './input/list-user-group.input';
import {
  UpdateUserCognito,
} from 'user/application/use-cases/cognito/update-user-cognito';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  DisableUserCognito,
} from 'user/application/use-cases/cognito/disable-user-cognito';
import {
  ListUserCognito,
} from 'user/application/use-cases/cognito/list-user-cognito';
import {
  UserCognitoController,
} from 'user/interface/cognito/user-cognito.controller';
import {
  UpdateUserInput,
} from 'user/interface/cognito/input/update-user.input';

describe('UserCognitoController', () => {
  let userCognitoController: UserCognitoController;
  let registerUserCognitoMock: jest.Mocked<RegisterUserCognito>;
  let updateUserCognitoMock: jest.Mocked<UpdateUserCognito>;
  let disableUserCognitoMock: jest.Mocked<DisableUserCognito>;
  let listUserCognitoMock: jest.Mocked<ListUserCognito>;
  let addUserGroupCognitoMock: jest.Mocked<AddUserGroupCognito>;
  let removeUserGroupCognitoMock: jest.Mocked<RemoveUserGroupCognito>;
  let listUserGroupCognitoMock: jest.Mocked<ListUserGroupCognito>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCognitoController],
      providers: [
        {
          provide: RegisterUserCognito,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateUserCognito,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: DisableUserCognito,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ListUserCognito,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: AddUserGroupCognito,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: RemoveUserGroupCognito,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ListUserGroupCognito,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    userCognitoController = module.get<UserCognitoController>(UserCognitoController);
    registerUserCognitoMock = module.get<RegisterUserCognito>(
      RegisterUserCognito,
    ) as jest.Mocked<RegisterUserCognito>;

    updateUserCognitoMock = module.get<UpdateUserCognito>(
      UpdateUserCognito,
    ) as jest.Mocked<UpdateUserCognito>;

    disableUserCognitoMock = module.get<DisableUserCognito>(
      DisableUserCognito,
    ) as jest.Mocked<DisableUserCognito>;

    listUserCognitoMock = module.get<ListUserCognito>(
      ListUserCognito,
    ) as jest.Mocked<ListUserCognito>;

    addUserGroupCognitoMock = module.get<AddUserGroupCognito>(
      AddUserGroupCognito,
    ) as jest.Mocked<AddUserGroupCognito>;

    removeUserGroupCognitoMock = module.get<RemoveUserGroupCognito>(
      RemoveUserGroupCognito,
    ) as jest.Mocked<RemoveUserGroupCognito>;

    listUserGroupCognitoMock = module.get<ListUserGroupCognito>(
      ListUserGroupCognito,
    ) as jest.Mocked<ListUserGroupCognito>;
  });

  it('should register a user successfully', async () => {
    const mockInput: RegisterUserInput = {
      name: 'Test User',
      email: 'testuser@example.com',
    };

    const mockResponse = { UserSub: 'mock-user-sub' };
    registerUserCognitoMock.execute.mockResolvedValueOnce(mockResponse);

    const result = await userCognitoController.registerUser(mockInput);

    expect(result).toEqual(mockResponse);
    expect(registerUserCognitoMock.execute).toHaveBeenCalledWith(mockInput);
    expect(registerUserCognitoMock.execute).toHaveBeenCalledTimes(1);
  });

  it('should update a user successfully', async () => {
    const mockInput: UpdateUserInput = {
      cognitoId: generateUuidV4(),
      name: 'Test User',
      email: 'testuser@example.com',
    };

    const mockResponse = { UserSub: 'mock-user-sub' };
    updateUserCognitoMock.execute.mockResolvedValueOnce(mockResponse);

    const result = await userCognitoController.updateUser(mockInput);

    expect(result).toEqual(mockResponse);
    expect(updateUserCognitoMock.execute).toHaveBeenCalledWith(mockInput);
    expect(updateUserCognitoMock.execute).toHaveBeenCalledTimes(1);
  });

  it('should disable a user successfully', async () => {
    const cognitoId = generateUuidV4();

    const mockResponse = { UserSub: 'mock-user-sub' };
    disableUserCognitoMock.execute.mockResolvedValueOnce(mockResponse);

    const result = await userCognitoController.deleteUser(cognitoId);

    expect(result).toEqual(mockResponse);
    expect(disableUserCognitoMock.execute).toHaveBeenCalledWith({ cognitoId });
    expect(disableUserCognitoMock.execute).toHaveBeenCalledTimes(1);
  });

  it('should list a user successfully', async () => {
    const uuid = generateUuidV4();

    const mockResponse = {
      list: [{
        username: 'testuser',
        group: 'admin',
        uuid,
        name: 'testuser',
        email: 'teste@teste.com.br',
        userStatus: 'CONFIRMED',
        enabled: true,
      }],
      nextToken: 'nextToken',
    };

    listUserCognitoMock.execute.mockResolvedValueOnce(mockResponse);

    const result = await userCognitoController.listUser(uuid);

    expect(result).toEqual(mockResponse);
    expect(listUserCognitoMock.execute).toHaveBeenCalledWith({
      filter: uuid,
      limit: 10,
    });
    expect(listUserCognitoMock.execute).toHaveBeenCalledTimes(1);
  });

  it('should add a user to a group successfully', async () => {
    const mockInput: AddUserGroupInput = {
      username: 'testuser',
      group: 'admin',
    };

    await userCognitoController.addUserGroup(mockInput);

    expect(addUserGroupCognitoMock.execute).toHaveBeenCalledWith(mockInput);
    expect(addUserGroupCognitoMock.execute).toHaveBeenCalledTimes(1);
  });

  it('should remove a user from a group successfully', async () => {
    const mockInput: RemoveUserGroupInput = {
      username: 'testuser',
      group: 'admin',
    };

    await userCognitoController.removeUserGroup(mockInput);

    expect(removeUserGroupCognitoMock.execute).toHaveBeenCalledWith(mockInput);
    expect(removeUserGroupCognitoMock.execute).toHaveBeenCalledTimes(1);
  });

  it('should list groups for a user successfully', async () => {
    const mockInput: ListUserGroupInput = {
      username: 'testuser',
    };

    const mockResponse = [
      { GroupName: 'admin', Description: 'Admin group' },
      { GroupName: 'user', Description: 'User group' },
    ];
    listUserGroupCognitoMock.execute.mockResolvedValueOnce(mockResponse);

    const result = await userCognitoController.listUserGroup(mockInput);

    expect(result).toEqual(mockResponse);
    expect(listUserGroupCognitoMock.execute).toHaveBeenCalledWith(mockInput);
    expect(listUserGroupCognitoMock.execute).toHaveBeenCalledTimes(1);
  });
});
