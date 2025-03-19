import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { CustomerRepository } from '../../../infrastructure/customer.repository';
import { UUID } from 'shared/types/uuid';

interface ExecuteCommand {
  uuid: UUID;
}

@Injectable()
export class DeleteCustomer extends UseCase {
  constructor(
    @Inject(CustomerRepository)
    private readonly repository: CustomerRepository,
  ) {
    super();
  }

  async execute(command: ExecuteCommand): Promise<void> {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('Customer UUID is required');

    const customer = await this.repository.findOneByUuid(uuid);

    if (!customer) throw new NotFoundException('Customer not found');

    await this.repository.delete(uuid);
  }
}
