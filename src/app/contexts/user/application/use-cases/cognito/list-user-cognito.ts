import { Injectable } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';

type executeCommand = {
  filter?: string;
  limit?: number;
  nextToken?: string
};

@Injectable()
export class ListUserCognito extends UseCase {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor() {
    super();
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  private normalizeUser(cognitoUser: any): User {
    const emailAttribute = cognitoUser.Attributes.find(
      (attr) => attr.Name === 'email',
    );
    const nameAttribute = cognitoUser.Attributes.find(
      (attr) => attr.Name === 'name',
    );

    return {
      uuid: cognitoUser.Username,
      username: cognitoUser.Username,
      name: nameAttribute?.Value || 'Unknown',
      email: emailAttribute?.Value || 'Unknown',
      userStatus: cognitoUser.UserStatus,
      enabled: cognitoUser.Enabled,
    };
  }

  async execute(command: executeCommand): Promise<Output> {
    const { filter, limit, nextToken } = command;


    try {
      const getCommand = new ListUsersCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Filter: filter,
        Limit: limit || 10,
        PaginationToken: nextToken,
      });

      const response = await this.cognitoClient.send(getCommand);

      const active = (response.Users || []).filter((user) => user.Enabled);

      return {
        list: active.map((user) => this.normalizeUser(user)) || [],
        nextToken: response.PaginationToken,
      };
    } catch (error) {
      throw error;
    }
  }
}

type Output = {
  list: User[],
  nextToken: string,
};

type User = {
  uuid: UUID;
  name: string;
  username: string;
  email: string;
  userStatus: string;
  enabled: boolean;
}


