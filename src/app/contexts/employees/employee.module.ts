import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from './infrastructure/employee.entity';
import { infrastructure } from './infrastructure';
import { useCases } from './application/use-cases';
import { EmployeeController } from './interface/employee.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity])],
  controllers: [EmployeeController],
  providers: [...infrastructure, ...useCases],
  exports: [...infrastructure],
})
export class EmployeeModule {}
