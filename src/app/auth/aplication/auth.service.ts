import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { generateSecretHash } from './generate-secret-hash';
import { UserRepository } from 'user/infrastructure/user.repository';

@Injectable()
export class AuthService {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor(
    @Inject(UserRepository)
    protected userRepository: UserRepository,
  ) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
  }

  async authenticateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneByUsername(username);

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    try {
      const secretHash = generateSecretHash(user?.email?.getValue());

      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.COGNITO_APP_CLIENT_ID,
        AuthParameters: {
          USERNAME: user?.email?.getValue(),
          PASSWORD: password,
          SECRET_HASH: secretHash,
        },
      });

      const response = await this.cognitoClient.send(command);

      return {
        user: {
          uuid: user.uuid,
          cognitoId: user.cognitoId,
          username: user.username,
          email: user.email?.getValue(),
          name: user.person.name?.getValue(),
        },
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
        expiresIn: response.AuthenticationResult.ExpiresIn,
        tokenType: response.AuthenticationResult.TokenType,
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async validateToken(accessToken: string) {
    const command = new GetUserCommand({ AccessToken: accessToken });

    try {
      const response = await this.cognitoClient.send(command);

      const groupsAttribute = response.UserAttributes.find(
        (attr) => attr.Name === 'cognito:groups',
      );

      const groups = groupsAttribute?.Value
        ? typeof groupsAttribute.Value === 'string'
          ? groupsAttribute.Value.split(',')
          : []
        : [];

      return {
        username: response.Username,
        groups,
        attributes: response.UserAttributes.reduce((acc, attr) => {
          acc[attr.Name] = attr.Value;
          return acc;
        }, {}),
      };
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}
