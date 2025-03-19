import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  LoggerService,
} from '@nestjs/common';
import {
  AdminAddUserToGroupCommand,
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { UseCase } from 'shared/abstracts/use-case';
import { generateSecretHash } from 'auth/aplication/generate-secret-hash';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

interface executeCommand {
  name: string;
  email: string;
}

@Injectable()
export class RegisterUserCognito extends UseCase {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    super();
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
  }

  async addUserGroupDefault(uuid): Promise<any> {
    const command = new AdminAddUserToGroupCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: uuid,
      GroupName: 'user',
    });

    await this.cognitoClient.send(command);
  }


  async execute(command: executeCommand): Promise<any> {
    const { name, email } = command;

    const secretHash = generateSecretHash(email);

    const commandInput = new SignUpCommand({
      ClientId: process.env.COGNITO_APP_CLIENT_ID,
      Username: email,
      Password: 'Temporary1@',
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
      ],
      SecretHash: secretHash,
    });

    try {
      const response = await this.cognitoClient.send(commandInput);
      const userUuid = response.UserSub;

      await this.addUserGroupDefault(userUuid);

      return {
        uuid: userUuid,
        email,
        name,
      };

    } catch (error) {
      if (error.name === 'UsernameExistsException') {
        throw new ConflictException('User already exists.');
      }

      this.logger.error(error);
      throw new InternalServerErrorException('Error creating user.');
    }
  }
}
