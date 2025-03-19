import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { useCases } from './application/use-cases';
import { CompanyController } from './interface/company.controller';
import { CompanyEntity } from './infrastructure/company.entity';
import { infrastructure } from './infrastructure';
import { CityModule } from 'commons/locations/city/city.module';
import { StateModule } from 'commons/locations/state/state.module';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity]), CityModule, StateModule],
  controllers: [CompanyController],
  providers: [...infrastructure, ...useCases],
  exports: [...infrastructure],
})
export class CompanyModule {
}
