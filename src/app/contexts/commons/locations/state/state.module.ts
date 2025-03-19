import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateEntity } from './infrastructure/state.entity';
import { StateController } from './interface/state.controller';
import { StateService } from './application/state.service';

@Module({
  imports: [TypeOrmModule.forFeature([StateEntity])],
  controllers: [StateController],
  providers: [StateService],
  exports: [StateService],
})
export class StateModule {
}
