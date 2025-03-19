import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import {
  CustomerRepository,
} from 'customer/infrastructure/customer.repository';
import {
  CustomerRelationFetch,
} from 'customer/application/use-cases/customer-relation-fetch';
import {
  executeCreateCommand,
} from 'customer/application/use-cases/create/create-customer.command';
import {
  Output,
} from 'customer/application/use-cases/create/create-customer-output.type';
import {
  CreateCustomerOutputAdapter,
} from 'customer/application/use-cases/create/create-customer-output.adapter';
import { Customer } from 'customer/domain/customer';


@Injectable()
export class CreateCustomer extends UseCase {
  constructor(
    @Inject(CustomerRepository)
    protected repository: CustomerRepository,
    private readonly relationFetcher: CustomerRelationFetch,
  ) {
    super();
  }

  async execute(
    command: executeCreateCommand,
  ): Promise<Output> {
    const {
      activities,
      persons,
      cropInformation,
      crops,
    } = await this.relationFetcher.fetchRelations(command);

    const customer = Customer.create({
      identifier: command.identifier,
      groupIdentifier: command.groupIdentifier,
      description: command.description,
      financialTools: command.financialTools,
      receivesLandRent: command.receivesLandRent,
      grainConsumer: command.grainConsumer,
      locations: command.locations?.map(location => ({
        name: location.name,
        description: location.description,
        address: location.address,
        coordinates: location.coordinates ? {
          lat: location.coordinates.lat,
          long: location.coordinates.long,
        } : undefined,
        totalHectares: location.totalHectares,
      })) || [],
      activities,
      persons,
      cropInformation,
      crops,
    });

    const saved = await this.repository.create(customer);
    return CreateCustomerOutputAdapter.execute(saved);
  }
}


