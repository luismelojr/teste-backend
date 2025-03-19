import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { useCases } from './application/use-cases';
import { PersonController } from './interface/person.controller';
import { PersonEntity } from './infrastructure/person.entity';
import { infrastructure } from './infrastructure';
import { CityModule } from 'commons/locations/city/city.module';
import { StateModule } from 'commons/locations/state/state.module';

@Module({
  imports: [TypeOrmModule.forFeature([PersonEntity]), CityModule, StateModule],
  controllers: [PersonController],
  providers: [...infrastructure, ...useCases],
  exports: [...infrastructure],
})
export class PersonModule {
}
