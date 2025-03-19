import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { useCases } from './application/use-cases';
import { EventTypeController } from './interface/event-type.controller';
import { EventTypeEntity } from './infrastructure/event-type.entity';
import { infrastructure } from './infrastructure';

@Module({
  imports: [TypeOrmModule.forFeature([EventTypeEntity])],
  controllers: [EventTypeController],
  providers: [...infrastructure, ...useCases],
  exports: [...infrastructure],
})
export class EventTypeModule {
}
