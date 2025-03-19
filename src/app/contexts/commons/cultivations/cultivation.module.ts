import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CultivationEntity
} from 'commons/cultivations/infrastructure/cultivation.entity';
import { infrastructure } from 'commons/cultivations/infrastructure';
import { useCases } from 'commons/cultivations/application/use-cases';
import {
  CultivationController
} from 'commons/cultivations/interface/cultivation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CultivationEntity])],
  controllers: [CultivationController],
  providers: [...infrastructure, ...useCases],
  exports: [...infrastructure]
})
export class CultivationModule {}
