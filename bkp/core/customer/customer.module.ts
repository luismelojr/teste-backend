import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './infrastructure/customer.entity';
import { infrastructure } from './infrastructure';
import { useCases } from './application/use-cases';
import { CustomerController } from './interface/customer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [CustomerController],
  providers: [...infrastructure, ...useCases],
  exports: [...infrastructure],
})
export class CustomerModule {}
