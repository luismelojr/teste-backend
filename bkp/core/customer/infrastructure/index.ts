import { Provider } from '@nestjs/common';
import { CustomerEntity } from './customer.entity';
import { CustomerRepository } from './customer.repository';
import { CustomerRepositoryImpl } from './customer.repository.impl';

export const infrastructure: Provider[] = [
  {
    provide: CustomerEntity,
    useValue: CustomerEntity
  },
  {
    provide: CustomerRepository,
    useClass: CustomerRepositoryImpl
  }
]
