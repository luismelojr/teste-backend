import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './infrastructure/city.entity';
import { CityService } from './application/city.service';
import { CitiesController } from './interface/cities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity])],
  controllers: [CitiesController],
  providers: [CityService],
  exports:[CityService],
})
export class CityModule {
}
