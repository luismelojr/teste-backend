import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  AdminAddUserToGroupCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { UseCase } from 'shared/abstracts/use-case';

interface executeCommand {
  username: string;
  group: string;
}

@Injectable()
export class AddUserGroupCognito extends UseCase {
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

  async execute(command: executeCommand): Promise<any> {
    const { username, group } = command;
    try {
      const command = new AdminAddUserToGroupCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
        GroupName: group,
      });
      await this.cognitoClient.send(command);
    } catch (error) {
      throw new InternalServerErrorException('Error adding user to groups.');
    }
  }
}
