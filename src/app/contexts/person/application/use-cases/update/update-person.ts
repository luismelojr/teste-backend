import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PersonRepository } from 'person/infrastructure/person.repository';
import { UseCase } from 'shared/abstracts/use-case';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { Person } from 'person/domain/person';
import { UUID } from 'shared/types/uuid';
import { CityService } from 'commons/locations/city/application/city.service';

interface executeCommand {
  uuid: UUID;
  name: string;
  cpf: string;
  phone?: string;
  city?: { uuid: string };
  address?: string;
  gender?: PersonGenderType;
}

@Injectable()
export class UpdatePerson extends UseCase {
  constructor(
    @Inject(PersonRepository)
    protected repository: PersonRepository,
    protected cityService: CityService,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { uuid, name, cpf, phone, city, address, gender } = command;

    const personDb = await this.repository.findOneByUuid(uuid);

    if (!personDb) throw new NotFoundException('person is not found');

    let cityToSave = personDb.city || undefined;

    if (city) {
      cityToSave = await this.cityService.findOneByUuid(city.uuid);
    }

    const person = new Person({
      id: personDb.id,
      uuid,
      name,
      cpf,
      phone,
      city: cityToSave,
      address,
      gender,
    });

    const saved = await this.repository.update(person);

    return {
      uuid: saved.uuid,
      name: saved.name?.getValue(),
      cpf: saved.cpf?.getValue(),
      phone: saved.phone?.getValue(),
      city: cityToSave ? {
        uuid: city?.uuid,
      } : undefined,
      address: saved.address || undefined,
      gender: saved.gender || undefined,
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
