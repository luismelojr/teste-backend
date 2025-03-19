import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { CustomerRepository } from '../../../infrastructure/customer.repository';
import { UUID } from 'shared/types/uuid';
import { Customer } from '../../../domain/customer';

interface ExecuteCommand {
  uuid: UUID;
  identifier: string;
  group_identifier?: string;
  description?: string;
  financial_tools?: boolean;
  grain_consumer?: boolean;
  own_grain?: boolean;
  annual_quantity?: number;
  receive_third_grains?: boolean;
  receives_land_rent?: boolean;
}

@Injectable()
export class UpdateCustomer extends UseCase {
  constructor(
    @Inject(CustomerRepository)
    private readonly repository: CustomerRepository,
  ) {
    super();
  }

  async execute(command: ExecuteCommand): Promise<Output> {
    const {
      uuid,
      identifier,
      group_identifier,
      description,
      financial_tools,
      grain_consumer,
      own_grain,
      annual_quantity,
      receive_third_grains,
      receives_land_rent,
    } = command;

    if (!uuid) throw new BadRequestException('Customer UUID is required');
    if (!identifier) throw new BadRequestException('Identifier is required');

    const customerDB = await this.repository.findOneByUuid(uuid);
    if (!customerDB) throw new NotFoundException('Customer not found');

    // Se for um Customer completo, validar os campos obrigatórios
    if (group_identifier) {
      if (financial_tools === undefined) throw new BadRequestException('Financial Tools is required');
      if (grain_consumer === undefined) throw new BadRequestException('Grain Consumer is required');
      if (receives_land_rent === undefined) throw new BadRequestException('Receives Land Rent is required');
    }

    const updatedCustomer = new Customer({
      id: customerDB.id,
      uuid,
      identifier,
      group_identifier,
      description,
      financial_tools,
      grain_consumer,
      own_grain,
      annual_quantity,
      receive_third_grains,
      receives_land_rent,
    });

    const saved = await this.repository.update(updatedCustomer);

    return {
      uuid: saved.uuid,
      identifier: saved.identifier,
      group_identifier: saved.group_identifier,
      description: saved.description,
      financial_tools: saved.financial_tools,
      grain_consumer: saved.grain_consumer,
      own_grain: saved.own_grain,
      annual_quantity: saved.annual_quantity,
      receive_third_grains: saved.receive_third_grains,
      receives_land_rent: saved.receives_land_rent,
    };
  }
}

type Output = {
  uuid: UUID;
  identifier: string;
  group_identifier?: string;
  description?: string;
  financial_tools?: boolean;
  grain_consumer?: boolean;
  own_grain?: boolean;
  annual_quantity?: number;
  receive_third_grains?: boolean;
  receives_land_rent?: boolean;
};
