import { Injectable } from '@nestjs/common';
import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { UseCase } from 'shared/abstracts/use-case';

interface executeCommand {
  cognitoId: string;
  name: string;
  email: string;
}

@Injectable()
export class UpdateUserCognito extends UseCase {
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
    const { cognitoId, name, email } = command;

    const commandInput = new AdminUpdateUserAttributesCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: cognitoId,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
      ],
    });

    return await this.cognitoClient.send(commandInput);
  }
}
