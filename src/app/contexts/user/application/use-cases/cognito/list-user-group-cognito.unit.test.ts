import {
  AdminListGroupsForUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { GroupType } from '@aws-sdk/client-cognito-identity-provider/dist-types/models/models_0';
import { ListUserGroupCognito } from './list-user-group-cognito';

jest.mock('@aws-sdk/client-cognito-identity-provider');

describe('ListUserGroupCognito', () => {
  let listUserGroupCognito: ListUserGroupCognito;
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

    listUserGroupCognito = new ListUserGroupCognito();
    (listUserGroupCognito as any).cognitoClient = cognitoClientMock;
  });

  it('should return groups for the user successfully', async () => {
    const mockGroups: GroupType[] = [
      { GroupName: 'admin', Description: 'Admin group' },
      { GroupName: 'user', Description: 'User group' },
    ];

    cognitoClientMock.send.mockResolvedValueOnce({
      Groups: mockGroups,
    } as never);

    const command = { username: 'testuser' };

    const result = await listUserGroupCognito.execute(command);

    expect(result).toEqual(mockGroups);
    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(AdminListGroupsForUserCommand),
    );
    expect(cognitoClientMock.send).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the request fails', async () => {
    cognitoClientMock.send.mockRejectedValueOnce(
      new Error('AWS error') as never,
    );

    const command = { username: 'testuser' };

    await expect(listUserGroupCognito.execute(command)).rejects.toThrow(
      'AWS error',
    );

    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(AdminListGroupsForUserCommand),
    );
    expect(cognitoClientMock.send).toHaveBeenCalledTimes(1);
  });
});
