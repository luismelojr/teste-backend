import {
  AdminDisableUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { UUID } from 'shared/types/uuid';
import { DisableUserCognito } from './disable-user-cognito';

jest.mock('@aws-sdk/client-cognito-identity-provider');

describe('DisableUserCognito', () => {
  let disableUserCognito: DisableUserCognito;
  let cognitoClientMock;

  beforeEach(() => {
    cognitoClientMock = {
      send: jest.fn(),
    };

    CognitoIdentityProviderClient.prototype.send = cognitoClientMock.send;

    disableUserCognito = new DisableUserCognito();
  });

  it('should disable a user successfully', async () => {
    const mockUuid: UUID = 'mock-uuid-1234';

    // Mock response do send
    cognitoClientMock.send.mockResolvedValueOnce(undefined);

    await expect(
      disableUserCognito.execute({ cognitoId: mockUuid }),
    ).resolves.not.toThrow();

    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(AdminDisableUserCommand),
    );
    expect(cognitoClientMock.send).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if Cognito fails', async () => {
    const mockUuid: UUID = 'mock-uuid-5678';

    cognitoClientMock.send.mockRejectedValueOnce(
      new Error('Cognito failure'),
    );

    await expect(
      disableUserCognito.execute({ cognitoId: mockUuid }),
    ).rejects.toThrow('Cognito failure');

    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(AdminDisableUserCommand),
    );
  });
});
