import { Injectable } from '@nestjs/common';
import {
  AdminDisableUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';

interface executeCommand {
  cognitoId: UUID;
}

@Injectable()
export class DisableUserCognito extends UseCase {
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
    const { cognitoId } = command;

    const commandInput = new AdminDisableUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: cognitoId,
    });

    await this.cognitoClient.send(commandInput);
  }
}
