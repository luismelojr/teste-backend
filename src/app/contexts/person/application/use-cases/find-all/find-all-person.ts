import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { PersonRepository } from 'person/infrastructure/person.repository';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { UUID } from 'shared/types/uuid';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { Person } from 'person/domain/person';

interface executeCommand {
  pagination?: PaginationInput;
  searchText?: string;
}

@Injectable()
export class FindAllPerson extends UseCase {
  constructor(
    @Inject(PersonRepository)
    protected repository: PersonRepository,
  ) {
    super();
  }

  outputAdapter(result: Person[]): PersonOutput[] {
    return result.map((person) => {
      return {
        uuid: person.uuid,
        name: person.name.getValue(),
        cpf: person.cpf ? person.cpf.getValue() : '',
        phone: person.phone.getValue() || undefined,
        city: person.city ? {
          uuid: person.city?.uuid,
          name: person.city?.name,
        } : undefined,
        address: person.address || undefined,
        gender: person.gender || undefined,
      };
    });
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { pagination, searchText } = command;

    const result = await this.repository.findAll({
      pagination,
      searchText,
    });

    return {
      data: this.outputAdapter(result?.data),
      total: result.total,
    };

  }
}

type PersonOutput = {
  uuid: UUID;
  name: string;
  cpf: string;
  phone: string;
  city: {
    uuid: UUID,
    name: string,
  };
  address: string;
  gender: PersonGenderType;
}

type Output = {
  data: PersonOutput[];
  total: number,
};
