import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { UserRepository } from 'user/infrastructure/user.repository';
import { User } from 'user/domain/user';
import {
  UpdateUserCognito,
} from 'user/application/use-cases/cognito/update-user-cognito';

interface executeCommand {
  uuid: UUID;
  username: string;
  email: string;
}

@Injectable()
export class UpdateUser extends UseCase {
  constructor(
    @Inject(UserRepository)
    protected repository: UserRepository,
    protected updateUserCognito: UpdateUserCognito,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { uuid, username, email } = command;

    const userDb = await this.repository.findOneByUuid(uuid);
    if (!userDb) throw new NotFoundException('user is not found');

    const user = new User({
      id: userDb.id,
      cognitoId: userDb.cognitoId,
      uuid,
      username,
      email,
      person: {
        id: userDb.person?.id,
        uuid: userDb.person?.uuid,
        name: userDb.person?.name?.getValue(),
        cpf: userDb.person?.cpf?.getValue(),
      },
    });

    const saved = await this.repository.update(user);

    await this.updateUserCognito.execute({
      cognitoId: saved.cognitoId,
      name: userDb.person.name.getValue(),
      email,
    });

    return {
      uuid: saved.uuid,
      cognitoId: saved.cognitoId,
      username: saved.username,
      email: saved.email.getValue(),
    };
  }
}

type Output = {
  uuid: UUID;
  cognitoId: string;
  username: string;
  email: string;
};
