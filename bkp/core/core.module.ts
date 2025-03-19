import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './Entities';

@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
})
export class PersonModule {
}
