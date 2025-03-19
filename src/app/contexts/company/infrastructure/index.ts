import { Provider } from '@nestjs/common';
import { CompanyEntity } from './company.entity';
import { CompanyRepository } from './company.repository';
import { CompanyRepositoryImpl } from './company.repository.impl';

export const infrastructure: Provider[] = [
  {
    provide: CompanyEntity,
    useValue: CompanyEntity,
  },
  {
    provide: CompanyRepository,
    useClass: CompanyRepositoryImpl,
  },
];
