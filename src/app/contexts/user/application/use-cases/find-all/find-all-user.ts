import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { UUID } from 'shared/types/uuid';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { UserRepository } from 'user/infrastructure/user.repository';

interface executeCommand {
  pagination?: PaginationInput;
  searchText?: string;
}

@Injectable()
export class FindAllUser extends UseCase {
  constructor(
    @Inject(UserRepository)
    protected repository: UserRepository,
  ) {
    super();
  }

  outputAdapter(result) {
    return result.data.map((user) => {
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
          phone: person.phone?.getValue() || undefined,
          city: person.city ? {
            uuid: person.city?.uuid,
          } : undefined,
          address: person.address || undefined,
          gender: person.gender || undefined,
        },
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
      data: this.outputAdapter(result),
      total: result.total,
    };

  }
}

type Output = {
  data: {
    uuid: UUID;
    cognitoId: string;
    username: string;
    email: string;
    person: {
      uuid: UUID;
      name: string;
      cpf: string;
      phone: string;
      city: {
        uuid: UUID,
      };
      address: string;
      gender: PersonGenderType;
    }
  }
  total: number,
};
