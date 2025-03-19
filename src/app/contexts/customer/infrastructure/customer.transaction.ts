import { QueryRunner } from 'typeorm';
import {
  CustomerEntity,
} from 'customer/infrastructure/entities/customer.entity';
import {
  CustomerCropEntity,
} from 'customer/infrastructure/entities/customer-crop.entity';

export class CustomerTransaction {
  static async handleSoftDeletes(entity: CustomerEntity, existingCustomer: CustomerEntity, queryRunner: QueryRunner): Promise<void> {
    await this.softDeleteItems(existingCustomer.locations, entity.locations, queryRunner);
    await this.softDeleteItems(existingCustomer.activities, entity.activities, queryRunner);
    await this.softDeleteItems(existingCustomer.persons, entity.persons, queryRunner);
    await this.softDeleteItems(existingCustomer.cropInformation, entity.cropInformation, queryRunner);

    for (const crop of existingCustomer.crops) {
      if (crop.locations.length > 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .relation(CustomerCropEntity, 'locations')
          .of(crop)
          .remove(crop.locations);
      }
    }
    await this.softDeleteItems(existingCustomer.crops, entity.crops, queryRunner);
  }

  static async softDeleteItems<T extends {
    uuid: string
  }>(existingItems: T[], newItems: T[], queryRunner: QueryRunner): Promise<void> {
    const newItemUUIDs = new Set(newItems?.map(item => item.uuid));
    const itemsToRemove = existingItems?.filter(item => !newItemUUIDs?.has(item.uuid));

    if (itemsToRemove?.length > 0) {
      await queryRunner.manager.softRemove(itemsToRemove);
    }
  }

  static async saveCustomerToUpdate(entity: CustomerEntity, existingCustomer: CustomerEntity, queryRunner: QueryRunner): Promise<CustomerEntity> {
    existingCustomer.identifier = entity.identifier;
    existingCustomer.groupIdentifier = entity.groupIdentifier;
    existingCustomer.description = entity.description;
    existingCustomer.financialTools = entity.financialTools;
    existingCustomer.receivesLandRent = entity.receivesLandRent;
    existingCustomer.grainConsumer = entity.grainConsumer;
    existingCustomer.ownGrain = entity.ownGrain;
    existingCustomer.receiveThirdGrains = entity.receiveThirdGrains;
    existingCustomer.annualQuantity = entity.annualQuantity;
    existingCustomer.activities = entity.activities;
    existingCustomer.persons = entity.persons;
    existingCustomer.cropInformation = entity.cropInformation;
    existingCustomer.crops = entity.crops;
    existingCustomer.locations = entity.locations;

    return queryRunner.manager.save(existingCustomer);
  }
}
