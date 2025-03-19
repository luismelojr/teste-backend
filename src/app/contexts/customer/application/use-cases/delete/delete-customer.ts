import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import {
  CustomerRepository,
} from 'customer/infrastructure/customer.repository';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class DeleteCustomer extends UseCase {
  constructor(
    @Inject(CustomerRepository)
    protected repository: CustomerRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ) {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    await this.repository.delete(uuid);

  }
}
