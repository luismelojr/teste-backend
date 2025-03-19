import { Provider } from '@nestjs/common';
import { EmployeeEntity } from './employee.entity';
import { EmployeeRepository } from './employee.repository';
import { EmployeeRepositoryIml } from './employee.repository.iml';

export const infrastructure: Provider[] = [
  {
    provide: EmployeeEntity,
    useValue: EmployeeEntity
  },
  {
    provide: EmployeeRepository,
    useClass: EmployeeRepositoryIml
  }
]
