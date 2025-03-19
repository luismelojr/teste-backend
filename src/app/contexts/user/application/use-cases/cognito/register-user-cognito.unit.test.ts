import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  AdminAddUserToGroupCommand,
  CognitoIdentityProviderClient,
  SignUpCommand,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { RegisterUserCognito } from './register-user-cognito';
import { generateSecretHash } from 'auth/aplication/generate-secret-hash';

jest.mock('@aws-sdk/client-cognito-identity-provider');
jest.mock('auth/aplication/generate-secret-hash');

describe('RegisterUserCognito', () => {
  let registerUserCognito: RegisterUserCognito;
  let loggerMock;
  let cognitoClientMock;

  beforeEach(() => {
    cognitoClientMock = new CognitoIdentityProviderClient({
      region: 'us-east-1',
    });

    cognitoClientMock.send = jest.fn();

    loggerMock = {
      error: jest.fn(),
    };

    registerUserCognito = new RegisterUserCognito(loggerMock);
    (registerUserCognito as any).cognitoClient = cognitoClientMock;
  });

  it('should register a user and add them to the default group', async () => {
    const mockName = 'John Doe';
    const mockEmail = 'john.doe@example.com';
    const mockUuid = 'mock-uuid-1234';

    const mockSecretHash = 'mockSecretHash';
    (generateSecretHash as jest.Mock).mockReturnValue(mockSecretHash);

    cognitoClientMock.send.mockResolvedValueOnce({
      UserSub: mockUuid,
    });

    cognitoClientMock.send.mockResolvedValueOnce(undefined);

    const result = await registerUserCognito.execute({
      name: mockName,
      email: mockEmail,
    });

    expect(result).toEqual({
      uuid: mockUuid,
      email: mockEmail,
      name: mockName,
    });

    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(SignUpCommand),
    );

    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(AdminAddUserToGroupCommand),
    );
  });

  it('should throw ConflictException if user already exists', async () => {
    cognitoClientMock.send.mockRejectedValueOnce(UsernameExistsException);

    const command = {
      name: 'Test User',
      username: 'testuser',
      email: 'testuser@example.com',
    };

    await expect(registerUserCognito.execute(command)).rejects.toThrow(
      new ConflictException('User already exists.'),
    );

    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(SignUpCommand),
    );
    expect(cognitoClientMock.send).toHaveBeenCalledTimes(1);
  });

  it('should throw InternalServerErrorException for other errors', async () => {
    cognitoClientMock.send.mockRejectedValueOnce(
      new InternalServerErrorException('Unknown error') as never,
    );

    const command = {
      name: 'Test User',
      username: 'testuser',
      email: 'testuser@example.com',
    };

    await expect(registerUserCognito.execute(command)).rejects.toThrow(
      new InternalServerErrorException('Error creating user.'),
    );
    expect(cognitoClientMock.send).toHaveBeenCalledWith(
      expect.any(SignUpCommand),
    );
    expect(cognitoClientMock.send).toHaveBeenCalledTimes(1);
  });
});
