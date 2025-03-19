import { InternalServerErrorException } from '@nestjs/common';
import {
  AdminRemoveUserFromGroupCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { RemoveUserGroupCognito } from './remove-user-group-cognito';

jest.mock('@aws-sdk/client-cognito-identity-provider');

describe('RemoveUserGroupCognito', () => {
  let removeUserGroupCognito: RemoveUserGroupCognito;
  let cognitoClientMock: jest.Mocked<CognitoIdentityProviderClient>;

  beforeEach(() => {
    cognitoClientMock = new CognitoIdentityProviderClient({
      region: 'us-east-1',
    }) as jest.Mocked<CognitoIdentityProviderClient>;

    cognitoClientMock.send = jest.fn();

    removeUserGroupCognito = new RemoveUserGroupCognito();
    (removeUserGroupCognito as any).cognitoClient = cognitoClientMock;
  });

  it('should remove a user from a group successfully', async () => {
    const mockCommand = {
      username: 'testuser',
      group: 'admin',
    };

    cognitoClientMock.send.mockResolvedValueOnce({} as never);

    await expect(
      removeUserGroupCognito.execute(mockCommand),
    ).resolves.toBeUndefined();

    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(AdminRemoveUserFromGroupCommand),
    );
    expect(cognitoClientMock.send).toHaveBeenCalledTimes(1);
  });

  it('should throw InternalServerErrorException if the request fails', async () => {
    const mockCommand = {
      username: 'testuser',
      group: 'admin',
    };

    cognitoClientMock.send.mockRejectedValueOnce(
      new Error('AWS error') as never,
    );

    await expect(removeUserGroupCognito.execute(mockCommand)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(AdminRemoveUserFromGroupCommand),
    );
    expect(cognitoClientMock.send).toHaveBeenCalledTimes(1);
  });
});
