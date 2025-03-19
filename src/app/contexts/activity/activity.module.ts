import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { useCases } from './application/use-cases';
import { ActivityController } from './interface/activity.controller';
import { ActivityEntity } from './infrastructure/activity.entity';
import { infrastructure } from './infrastructure';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityEntity])],
  controllers: [ActivityController],
  providers: [...infrastructure, ...useCases],
  exports: [...infrastructure],
})
export class ActivityModule {
}
