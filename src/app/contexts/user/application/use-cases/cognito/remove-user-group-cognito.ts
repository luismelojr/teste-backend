import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  AdminRemoveUserFromGroupCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { UseCase } from 'shared/abstracts/use-case';

interface executeCommand {
  username: string;
  group: string;
}

@Injectable()
export class RemoveUserGroupCognito extends UseCase {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor() {
    super();
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
  }

  async execute(command: executeCommand): Promise<any> {
    const { username, group } = command;
    try {
      const command = new AdminRemoveUserFromGroupCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
        GroupName: group,
      });
      await this.cognitoClient.send(command);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error removing user from groups.',
      );
    }
  }
}
