import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { UserRepository } from 'user/infrastructure/user.repository';
import {
  DisableUserCognito,
} from 'user/application/use-cases/cognito/disable-user-cognito';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class DeleteUser extends UseCase {
  constructor(
    @Inject(UserRepository)
    protected repository: UserRepository,
    protected disableUserCognito: DisableUserCognito,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ) {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const userDb = await this.repository.findOneByUuid(uuid);

    if (!userDb) throw new NotFoundException('user not found');

    await this.disableUserCognito.execute({ cognitoId: userDb.cognitoId });

    await this.repository.delete(uuid);

  }
}
