import { Provider } from '@nestjs/common';
import {
  CreateCustomer,
} from 'customer/application/use-cases/create/create-customer';
import {
  UpdateCustomer,
} from 'customer/application/use-cases/update/update-customer';
import {
  DeleteCustomer,
} from 'customer/application/use-cases/delete/delete-customer';
import {
  FindAllCustomer,
} from 'customer/application/use-cases/find-all/find-all-customer';
import {
  FindByUuidCustomer,
} from 'customer/application/use-cases/find-by-uuid/find-by-uuid-customer';
import {
  CustomerRelationFetch,
} from 'customer/application/use-cases/customer-relation-fetch';

export const useCases: Provider[] = [
  CreateCustomer,
  UpdateCustomer,
  DeleteCustomer,
  FindAllCustomer,
  FindByUuidCustomer,
  CustomerRelationFetch,
];
