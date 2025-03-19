import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { CustomerRepository } from '../../../infrastructure/customer.repository';
import { UUID } from 'shared/types/uuid';

interface ExecuteCommand {
  query: string;
}

@Injectable()
export class FindAutocompleteCustomer extends UseCase {
  constructor(
    @Inject(CustomerRepository)
    private readonly repository: CustomerRepository,
  ) {
    super();
  }

  async execute(command: ExecuteCommand): Promise<Output[]> {
    const { query } = command;

    return await this.repository.findAutoComplete(query);
  }
}

type Output = {
  uuid: UUID;
  identifier: string;
};
