import { Provider } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UserRepositoryImpl } from './user.repository.impl';

export const infrastructure: Provider[] = [
  {
    provide: UserEntity,
    useValue: UserEntity,
  },
  {
    provide: UserRepository,
    useClass: UserRepositoryImpl,
  },
];
