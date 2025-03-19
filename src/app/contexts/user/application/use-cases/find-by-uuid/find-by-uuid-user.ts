import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { UserRepository } from 'user/infrastructure/user.repository';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class FindByUuidUser extends UseCase {
  constructor(
    @Inject(UserRepository)
    protected repository: UserRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const user = await this.repository.findOneByUuid(uuid);

    if (!user) throw new NotFoundException('user is not found');

    const person = user.person;

    return {
      uuid: user.uuid,
      cognitoId: user.cognitoId,
      username: user.username,
      email: user.email.getValue(),
      person: {
        uuid: person.uuid,
        name: person.name?.getValue(),
        cpf: person.cpf?.getValue(),
      },

    };
  }
}

type Output = {
  uuid: UUID;
  cognitoId: string;
  username: string;
  email: string;
  person: {
    uuid: UUID;
    name: string;
    cpf: string;
  }
};
