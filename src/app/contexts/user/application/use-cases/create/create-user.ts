import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'user/infrastructure/user.repository';
import { UseCase } from 'shared/abstracts/use-case';
import { User } from 'user/domain/user';
import { UUID } from 'shared/types/uuid';
import { PersonRepository } from 'person/infrastructure/person.repository';
import {
  RegisterUserCognito,
} from 'user/application/use-cases/cognito/register-user-cognito';

interface executeCommand {
  username: string;
  email: string;
  person?: {
    uuid?: string,
    name: string,
    cpf: string,
  };
}

@Injectable()
export class CreateUser extends UseCase {
  constructor(
    @Inject(UserRepository)
    protected repository: UserRepository,
    @Inject(PersonRepository)
    protected personRepository: PersonRepository,
    protected registerUserCognito: RegisterUserCognito,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { username, email, person } = command;
    let personToSave = undefined;

    if (!username) {
      throw new BadRequestException('username is required');
    }

    if (!email) {
      throw new BadRequestException('email is required');
    }

    personToSave = await this.getPersonToSave(person);

    const { uuid: cognitoId } = await this.registerUserCognito.execute({
      name: username,
      email,
    });

    const user = User.create(cognitoId, username, email, personToSave);

    const saved = await this.repository.create(user);

    return {
      uuid: saved.uuid,
      cognitoId: saved.cognitoId,
      username: saved.username,
      email: saved.email.getValue(),
    };
  }

  private async getPersonToSave(person: {
    uuid?: string,
    name: string,
    cpf: string,
  }) {
    if (!person) throw new BadRequestException('Personal data is required');

    if (!person.cpf) {
      throw new BadRequestException('cpf is required');
    }

    if (!person.name) {
      throw new BadRequestException('name is required');
    }


    let personDb = undefined;
    if (person.uuid) {
      personDb = await this.personRepository.findOneByUuid(person.uuid);

      if (!personDb) throw new NotFoundException('person is not found');

    }

    return {
      id: personDb?.id || undefined,
      uuid: personDb?.uuid || undefined,
      name: person.name,
      cpf: person.cpf,
    };

  }
}

type Output = {
  uuid: UUID;
  cognitoId: string;
  username: string;
  email: string;
};
