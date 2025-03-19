import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRepository } from 'user/infrastructure/user.repository';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { faker } from '@faker-js/faker';
import { User } from 'user/domain/user';

jest.mock('@aws-sdk/client-cognito-identity-provider', () => {
  return {
    CognitoIdentityProviderClient: jest.fn().mockImplementation(() => ({
      send: jest.fn(),
    })),
    InitiateAuthCommand: jest.fn(),
    GetUserCommand: jest.fn(),
  };
});
jest.mock('./generate-secret-hash');

const uuid = generateUuidV4();

describe('AuthService', () => {
  let authService: AuthService;
  let cognitoClientMock;
  let userRepositoryMock;

  const mockPerson = {
    id: '1',
    uuid,
    name: 'Tony Stark',
    cpf: '61765766443',
    phone: '999999999',
    address: 'Wall Street',
    gender: PersonGenderType.MALE,
  };

  const mockUser = {
    id: '1',
    uuid,
    cognitoId: generateUuidV4(),
    username: '00000000000',
    email: faker.internet.email(),
  };

  beforeEach(async () => {
    userRepositoryMock = {
      findOneByUsername: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
        AuthService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    cognitoClientMock = (authService as any).cognitoClient;
    cognitoClientMock.send = jest.fn();
  });

  describe('authenticateUser', () => {
    it('should authenticate user and return tokens', async () => {
      const mockUsername = 'testuser';
      const mockPassword = 'testpassword';

      const mockResponse = {
        AuthenticationResult: {
          AccessToken: 'mockAccessToken',
          IdToken: 'mockIdToken',
          RefreshToken: 'mockRefreshToken',
          ExpiresIn: 3600,
          TokenType: 'Bearer',
        },
      };

      cognitoClientMock.send.mockResolvedValueOnce(mockResponse);
      userRepositoryMock.findOneByUsername.mockResolvedValueOnce(new User({
        ...mockUser,
        person: {
          id: '1',
          uuid: generateUuidV4(),
          ...mockPerson,
        },
      }));

      const result = await authService.authenticateUser(
        mockUsername,
        mockPassword,
      );

      expect(result).toEqual({
        user: {
          uuid: mockUser.uuid,
          cognitoId: mockUser.cognitoId,
          email: mockUser.email,
          username: mockUser.username,
          name: mockPerson.name,
        },
        accessToken: 'mockAccessToken',
        idToken: 'mockIdToken',
        refreshToken: 'mockRefreshToken',
        expiresIn: 3600,
        tokenType: 'Bearer',
      });

      expect(cognitoClientMock.send).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const mockUsername = 'testuser';
      const mockPassword = 'wrongpassword';

      cognitoClientMock.send.mockRejectedValueOnce(
        new Error('Invalid credentials'),
      );

      await expect(
        authService.authenticateUser(mockUsername, mockPassword),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException on user not exists', async () => {
      const mockUsername = 'testuser';
      const mockPassword = 'testpassword';

      userRepositoryMock.findOneByUsername.mockResolvedValueOnce(undefined);

      const mockResponse = {
        AuthenticationResult: {
          AccessToken: 'mockAccessToken',
          IdToken: 'mockIdToken',
          RefreshToken: 'mockRefreshToken',
          ExpiresIn: 3600,
          TokenType: 'Bearer',
        },
      };

      cognitoClientMock.send.mockResolvedValueOnce(mockResponse);

      await expect(
        authService.authenticateUser(mockUsername, mockPassword),
      ).rejects.toThrow(
        new UnauthorizedException('user not found'),
      );
    });
  });

  describe('validateToken', () => {
    it('should validate token and return user details', async () => {
      const mockAccessToken = 'mockAccessToken';
      const mockResponse = {
        Username: 'testuser',
        UserAttributes: [
          { Name: 'cognito:groups', Value: 'admin,manager' },
          { Name: 'email', Value: 'testuser@example.com' },
        ],
      };

      cognitoClientMock.send.mockResolvedValueOnce(mockResponse as never);

      const result = await authService.validateToken(mockAccessToken);

      expect(result).toEqual({
        username: 'testuser',
        groups: ['admin', 'manager'],
        attributes: {
          'cognito:groups': 'admin,manager',
          email: 'testuser@example.com',
        },
      });

      expect(cognitoClientMock.send).toHaveBeenCalledTimes(1);
    });

    it('should throw an error on invalid token', async () => {
      const mockAccessToken = 'invalidToken';

      cognitoClientMock.send.mockRejectedValueOnce(new Error('Invalid token'));

      await expect(authService.validateToken(mockAccessToken)).rejects.toThrow(
        'Token inválido',
      );
    });
  });
});
