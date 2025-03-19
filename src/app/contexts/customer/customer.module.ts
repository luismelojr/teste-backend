import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { infrastructure } from './infrastructure';
import { entities } from 'customer/infrastructure/entities';
import { ActivityModule } from 'activity/activity.module';
import { CropModule } from 'commons/crop/crop.module';
import { PersonModule } from 'person/person.module';
import { OccupationModule } from 'occupation/occupation.module';
import { CultivationModule } from 'commons/cultivations/cultivation.module';
import { useCases } from 'customer/application/use-cases';
import { CustomerController } from 'customer/interface/customer.controller';

@Module({
  controllers: [CustomerController],
  imports: [
    TypeOrmModule.forFeature([...entities]),
    ActivityModule,
    CropModule,
    PersonModule,
    OccupationModule,
    CultivationModule,
  ],
  providers: [...useCases, ...infrastructure],
  exports: [...infrastructure],
})
export class CustomerModule {}
