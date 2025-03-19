import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import {
  CustomerRepository,
} from 'customer/infrastructure/customer.repository';
import {
  FindByUuidCustomerOutputAdapter,
} from 'customer/application/use-cases/find-by-uuid/find-by-uuid-customer-output.adapter';
import {
  Output,
} from 'customer/application/use-cases/find-by-uuid/find-by-uuid-customer-output.type';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class FindByUuidCustomer extends UseCase {
  constructor(
    @Inject(CustomerRepository)
    protected repository: CustomerRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const customer = await this.repository.findOneByUuid(uuid);

    if (!customer) throw new NotFoundException('Customer is not found');

    return FindByUuidCustomerOutputAdapter.execute(customer);
  }
}

