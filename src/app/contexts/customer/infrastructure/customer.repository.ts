import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { Customer } from 'customer/domain/customer';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';
import { CustomerActivity } from 'customer/domain/aggregates/customer-activity';
import { CustomerCrop } from 'customer/domain/aggregates/customer-crop';
import {
  CustomerCropInformation,
} from 'customer/domain/aggregates/customer-crop-information';
import { CustomerPerson } from 'customer/domain/aggregates/customer-person';
import {
  CustomerCropInformationCultivation,
} from 'customer/domain/aggregates/customer-crop-information-cultivation';

export abstract class CustomerRepository {
  abstract create(customer: Customer): Promise<Customer>;

  abstract update(customer: Customer): Promise<Customer>;

  abstract delete(uuid: UUID): Promise<void>;

  abstract findOneById(id: EntityPrimaryKey): Promise<Customer>;

  abstract findOneByUuid(uuid: UUID): Promise<Customer>;

  abstract findAll({
                     pagination,
                     searchText,
                   }: {
    pagination: PaginationInput;
    searchText?: string;
  }): Promise<PaginationOutput<Customer>>;

  abstract findAutocomplete(query: string): Promise<any[]>;

  abstract findCustomerPersonByUuid(uuid: UUID): Promise<CustomerPerson>;

  abstract findCustomerActivityByUuid(uuid: UUID): Promise<CustomerActivity>;

  abstract findCustomerCropByUuid(uuid: UUID): Promise<CustomerCrop>;

  abstract findCustomerCropInformationByUuid(uuid: UUID): Promise<CustomerCropInformation>;

  abstract findCustomerCropInfoCultivationByUuid(uuid: UUID): Promise<CustomerCropInformationCultivation>;

}
