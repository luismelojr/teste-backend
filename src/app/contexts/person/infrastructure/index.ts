import { Provider } from '@nestjs/common';
import { PersonEntity } from './person.entity';
import { PersonRepository } from './person.repository';
import { PersonRepositoryImpl } from './person.repository.impl';

export const infrastructure: Provider[] = [
  {
    provide: PersonEntity,
    useValue: PersonEntity,
  },
  {
    provide: PersonRepository,
    useClass: PersonRepositoryImpl,
  },
];
