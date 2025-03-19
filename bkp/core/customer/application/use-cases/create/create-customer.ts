import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { CustomerRepository } from '../../../infrastructure/customer.repository';
import { Customer } from '../../../domain/customer';

interface ExecuteCommand {
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
export class CreateCustomer extends UseCase {
  constructor(
    @Inject(CustomerRepository)
    private readonly repository: CustomerRepository,
  ) {
    super();
  }

  async execute(command: ExecuteCommand): Promise<Output> {
    const {
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

    if (!identifier) throw new BadRequestException('Identifier is required');

    // Se for um Customer completo, validar os campos obrigatórios
    if (group_identifier) {
      if (financial_tools === undefined) throw new BadRequestException('Financial Tools is required');
      if (grain_consumer === undefined) throw new BadRequestException('Grain Consumer is required');
      if (receives_land_rent === undefined) throw new BadRequestException('Receives Land Rent is required');
    }

    const customer = Customer.create({
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

    const saved = await this.repository.create(customer);

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
  uuid: string;
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
