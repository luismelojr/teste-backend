import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { PersonRepository } from 'person/infrastructure/person.repository';
import { UUID } from 'shared/types/uuid';
import { PersonGenderType } from 'enumerates/person-gender-type';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class FindByUuidPerson extends UseCase {
  constructor(
    @Inject(PersonRepository)
    protected repository: PersonRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const person = await this.repository.findOneByUuid(uuid);

    if (!person) throw new NotFoundException('person is not found');

    return {
      uuid: person.uuid,
      name: person.name.getValue(),
      cpf: person.cpf.getValue(),
      phone: person.phone.getValue() || undefined,
      city: person.city ? {
        uuid: person.city?.uuid,
      } : undefined,
      address: person.address || undefined,
      gender: person.gender || undefined,
    };
  }
}

type Output = {
  uuid: UUID;
  name: string;
  cpf: string;
  phone: string;
  city: {
    uuid: UUID,
  };
  address: string;
  gender: PersonGenderType;
};
