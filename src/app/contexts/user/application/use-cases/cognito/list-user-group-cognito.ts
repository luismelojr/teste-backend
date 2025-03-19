import { Injectable } from '@nestjs/common';
import {
  AdminListGroupsForUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { UseCase } from 'shared/abstracts/use-case';
import { GroupType } from '@aws-sdk/client-cognito-identity-provider/dist-types/models/models_0';

type executeCommand = {
  username: string;
};

@Injectable()
export class ListUserGroupCognito extends UseCase {
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

  async execute(command: executeCommand): Promise<Output> {
    const { username } = command;
    try {
      const getCommand = new AdminListGroupsForUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
      });

      const response = await this.cognitoClient.send(getCommand);
      return response.Groups;
    } catch (error) {
      throw error;
    }
  }
}

type Output = GroupType[];
