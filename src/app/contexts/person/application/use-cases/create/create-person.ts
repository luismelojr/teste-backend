import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PersonRepository } from 'person/infrastructure/person.repository';
import { UseCase } from 'shared/abstracts/use-case';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { Person } from 'person/domain/person';
import { UUID } from 'shared/types/uuid';
import { CityService } from 'commons/locations/city/application/city.service';

interface executeCommand {
  name: string;
  cpf: string;
  phone?: string;
  city?: { uuid: string };
  address?: string;
  gender?: PersonGenderType;
}

@Injectable()
export class CreatePerson extends UseCase {
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
    const { name, cpf, phone, city, address, gender } = command;

    if (!name) {
      throw new BadRequestException('name is required');
    }
    if (!cpf) {
      throw new BadRequestException('cpf is required');
    }

    let cityToSave = undefined;

    if (city) {
      cityToSave = await this.cityService.findOneByUuid(city.uuid);
    }

    const person = Person.create(name, cpf, phone, cityToSave, address, gender);

    const saved = await this.repository.create(person);

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
