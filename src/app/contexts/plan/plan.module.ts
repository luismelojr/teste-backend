import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { useCases } from './application/use-cases';
import { PlanController } from './interface/plan.controller';
import { PlanEntity } from './infrastructure/entities/plan.entity';
import { infrastructure } from './infrastructure';
import {
  PlanFunctionEntity,
} from 'plan/infrastructure/entities/plan-function.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanEntity, PlanFunctionEntity])],
  controllers: [PlanController],
  providers: [...infrastructure, ...useCases],
  exports: [...infrastructure],
})
export class PlanModule {
}
