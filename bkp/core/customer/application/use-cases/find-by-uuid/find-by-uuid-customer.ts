import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { CustomerRepository } from '../../../infrastructure/customer.repository';
import { UUID } from 'shared/types/uuid';

interface ExecuteCommand {
  uuid: UUID;
}

@Injectable()
export class FindByUuidCustomer extends UseCase {
  constructor(
    @Inject(CustomerRepository)
    private readonly repository: CustomerRepository,
  ) {
    super();
  }

  async execute(command: ExecuteCommand): Promise<Output> {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('Customer UUID is required');

    const customer = await this.repository.findOneByUuid(uuid);

    if (!customer) throw new NotFoundException('Customer not found');

    return {
      uuid: customer.uuid,
      identifier: customer.identifier,
      group_identifier: customer.group_identifier,
      description: customer.description,
      financial_tools: customer.financial_tools,
      grain_consumer: customer.grain_consumer,
      own_grain: customer.own_grain,
      annual_quantity: customer.annual_quantity,
      receive_third_grains: customer.receive_third_grains,
      receives_land_rent: customer.receives_land_rent,
    };
  }
}

type Output = {
  uuid: UUID;
  identifier: string;
  group_identifier: string;
  description?: string;
  financial_tools: boolean;
  grain_consumer: boolean;
  own_grain?: boolean;
  annual_quantity?: number;
  receive_third_grains?: boolean;
  receives_land_rent: boolean;
};
