import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { useCases } from './application/use-cases';
import { UserController } from './interface/user.controller';
import { UserEntity } from './infrastructure/user.entity';
import { infrastructure } from './infrastructure';
import { CityModule } from 'commons/locations/city/city.module';
import { StateModule } from 'commons/locations/state/state.module';
import { PersonModule } from 'person/person.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CityModule, StateModule, PersonModule],
  controllers: [UserController],
  providers: [...infrastructure, ...useCases],
  exports: [...infrastructure],
})
export class UserModule {
}

