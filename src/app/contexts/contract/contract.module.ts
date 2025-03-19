import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { infrastructure } from './infrastructure';
import { ContractController } from './interface/contract.controller';
import { CompanyModule } from 'company/company.module';
import { PlanModule } from 'plan/plan.module';
import { PersonModule } from 'person/person.module';
import { ContractEntity } from 'contract/infrastructure/entities/contract.entity';
import { useCases } from 'contract/application/use-cases';
import { CustomerModule } from 'customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractEntity]),
    CompanyModule,
    PlanModule,
    PersonModule,
    CustomerModule,
  ],
  controllers: [ContractController],
  providers: [...infrastructure, ...useCases],
  exports: [...infrastructure],
})
export class ContractModule {}
