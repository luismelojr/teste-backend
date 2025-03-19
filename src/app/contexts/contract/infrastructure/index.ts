import { Provider } from '@nestjs/common';
import { ContractEntity } from './entities/contract.entity';
import { ContractRepository } from './contract.repository';
import { ContractRepositoryImpl } from './contract.repository.impl';

export const infrastructure: Provider[] = [
  {
    provide: ContractEntity,
    useValue: ContractEntity,
  },
  {
    provide: ContractRepository,
    useClass: ContractRepositoryImpl,
  },
];
