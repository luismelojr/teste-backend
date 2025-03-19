import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import {
  CustomerRepository,
} from 'customer/infrastructure/customer.repository';
import { Customer } from 'customer/domain/customer';
import {
  UpdateCustomerCommand,
} from 'customer/application/use-cases/update/update-customer.command';
import {
  CustomerRelationFetch,
} from 'customer/application/use-cases/customer-relation-fetch';
import {
  CustomerLocationRepository,
} from 'customer/infrastructure/customer-location.repository';
import {
  Output,
} from 'customer/application/use-cases/update/update-customer-output.type';
import {
  UpdateCustomerOutputAdapter,
} from 'customer/application/use-cases/update/update-customer-output.adapter';
import { CustomerLocation } from 'customer/domain/aggregates/custumer-location';


@Injectable()
export class UpdateCustomer extends UseCase {
  constructor(
    @Inject(CustomerRepository)
    protected repository: CustomerRepository,
    @Inject(CustomerLocationRepository)
    protected locationRepository: CustomerLocationRepository,
    private readonly relationFetcher: CustomerRelationFetch,
  ) {
    super();
  }

  async execute(command: UpdateCustomerCommand): Promise<Output> {
    const existingCustomer = await this.repository.findOneByUuid(command.uuid);
    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    const locations = await Promise.all(
      command.locations?.map(async (location) => {
        let foundLocation: CustomerLocation;

        if (location.uuid) {
          foundLocation = await this.locationRepository.findOneByUuid(location.uuid);

          if (!foundLocation) {
            throw new Error('Location not found');
          }
        }

        return {
          id: foundLocation?.id || undefined,
          uuid: foundLocation?.uuid || undefined,
          name: location.name,
          description: location.description,
          address: location.address,
          coordinates: location.coordinates ? {
            lat: location.coordinates.lat,
            long: location.coordinates.long,
          } : undefined,
          totalHectares: location.totalHectares,
        };
      }),
    );

    const {
      activities,
      persons,
      cropInformation,
      crops,
    } = await this.relationFetcher.fetchRelations(command);

    const updatedCustomer = new Customer({
      id: existingCustomer.id,
      uuid: command.uuid,
      identifier: command.identifier,
      groupIdentifier: command.groupIdentifier,
      description: command.description,
      financialTools: command.financialTools,
      receivesLandRent: command.receivesLandRent,
      grainConsumer: command.grainConsumer,
      locations,
      activities,
      persons,
      cropInformation,
      crops,
    });

    const savedCustomer = await this.repository.update(updatedCustomer);

    return UpdateCustomerOutputAdapter.execute(savedCustomer);
  }
}
