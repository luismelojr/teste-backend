import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { useCases } from './application/use-cases';
import { OccupationController } from './interface/occupation.controller';
import { OccupationEntity } from './infrastructure/occupation.entity';
import { infrastructure } from './infrastructure';

@Module({
  imports: [TypeOrmModule.forFeature([OccupationEntity])],
  controllers: [OccupationController],
  providers: [...infrastructure, ...useCases],
  exports: [...infrastructure],
})
export class OccupationModule {
}
