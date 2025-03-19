import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import {
  EmployeeRepository
} from '../../../infrastructure/employee.repository';
import { UUID } from 'shared/types/uuid';

interface executeCommand {
  query: string;
}

@Injectable()
export class FindAutocompleteEmployee extends UseCase {
  constructor(
    @Inject(EmployeeRepository)
    protected readonly repository: EmployeeRepository
  ) {
    super();
  }

  async execute(command: executeCommand): Promise<Output> {
    const { query } = command;

    return await this.repository.findAutoComplete(query);
  }
}

type Output = {
  uuid: UUID;
  business_phone: string;
  business_email: string;
}[]
