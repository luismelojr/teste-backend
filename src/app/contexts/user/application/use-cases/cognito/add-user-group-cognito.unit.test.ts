import { InternalServerErrorException } from '@nestjs/common';
import {
  AdminAddUserToGroupCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { AddUserGroupCognito } from './add-user-group-cognito';

jest.mock('@aws-sdk/client-cognito-identity-provider');

describe('AddUserGroupCognito', () => {
  let addUserGroupCognito: AddUserGroupCognito;
  let cognitoClientMock: jest.Mocked<CognitoIdentityProviderClient>;

  beforeEach(() => {
    cognitoClientMock = new CognitoIdentityProviderClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'mockAccessKeyId',
        secretAccessKey: 'mockSecretAccessKey',
      },
    }) as jest.Mocked<CognitoIdentityProviderClient>;

    cognitoClientMock.send = jest.fn();

    addUserGroupCognito = new AddUserGroupCognito();
    (addUserGroupCognito as any).cognitoClient = cognitoClientMock;
  });

  it('should add user to group successfully', async () => {
    cognitoClientMock.send.mockResolvedValueOnce({} as never);

    const command = { username: 'testuser', group: 'admin' };

    await expect(addUserGroupCognito.execute(command)).resolves.not.toThrow();

    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(AdminAddUserToGroupCommand),
    );
    expect(cognitoClientMock.send).toHaveBeenCalledTimes(1);
  });

  it('should throw InternalServerErrorException on failure', async () => {
    cognitoClientMock.send.mockRejectedValueOnce(
      new Error('AWS error') as never,
    );

    const command = { username: 'testuser', group: 'admin' };

    await expect(addUserGroupCognito.execute(command)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(AdminAddUserToGroupCommand),
    );
    expect(cognitoClientMock.send).toHaveBeenCalledTimes(1);
  });
});
