import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { ListUserCognito } from './list-user-cognito';

jest.mock('@aws-sdk/client-cognito-identity-provider');

describe('ListUserCognito', () => {
  let listUserCognito: ListUserCognito;
  let cognitoClientMock;

  beforeEach(() => {
    cognitoClientMock = {
      send: jest.fn(),
    };

    CognitoIdentityProviderClient.prototype.send = cognitoClientMock.send;

    listUserCognito = new ListUserCognito();
  });

  it('should list users with pagination and filter', async () => {
    const mockCommand = {
      filter: 'email ^= "test"',
      limit: 2,
      nextToken: 'mockNextToken',
    };

    const mockResponse = {
      Users: [
        {
          Username: 'user1',
          Attributes: [
            { Name: 'email', Value: 'user1@example.com' },
            { Name: 'name', Value: 'User One' },
          ],
          UserStatus: 'CONFIRMED',
          Enabled: true,
        },
        {
          Username: 'user2',
          Attributes: [
            { Name: 'email', Value: 'user2@example.com' },
            { Name: 'name', Value: 'User Two' },
          ],
          UserStatus: 'CONFIRMED',
          Enabled: true,
        },
      ],
      PaginationToken: 'newPaginationToken',
    };

    cognitoClientMock.send.mockResolvedValueOnce(mockResponse);

    const result = await listUserCognito.execute(mockCommand);

    expect(result).toEqual({
      list: [
        {
          uuid: 'user1',
          username: 'user1',
          name: 'User One',
          email: 'user1@example.com',
          userStatus: 'CONFIRMED',
          enabled: true,
        },
        {
          uuid: 'user2',
          username: 'user2',
          name: 'User Two',
          email: 'user2@example.com',
          userStatus: 'CONFIRMED',
          enabled: true,
        },
      ],
      nextToken: 'newPaginationToken',
    });

    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(ListUsersCommand),
    );
  });

  it('should handle no users found', async () => {
    const mockCommand = {
      filter: 'email ^= "nonexistent"',
      limit: 2,
      nextToken: undefined,
    };

    const mockResponse = {
      Users: [],
      PaginationToken: undefined,
    };

    cognitoClientMock.send.mockResolvedValueOnce(mockResponse);

    const result = await listUserCognito.execute(mockCommand);

    expect(result).toEqual({
      list: [],
      nextToken: undefined,
    });

    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(ListUsersCommand),
    );
  });

  it('should throw an error when Cognito fails', async () => {
    const mockCommand = {
      filter: 'email ^= "error"',
      limit: 2,
      nextToken: undefined,
    };

    cognitoClientMock.send.mockRejectedValueOnce(new Error('Cognito failure'));

    await expect(listUserCognito.execute(mockCommand)).rejects.toThrow(
      'Cognito failure',
    );

    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(ListUsersCommand),
    );
  });
});
