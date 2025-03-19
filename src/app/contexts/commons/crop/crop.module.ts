import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropEntity } from 'commons/crop/infrastructure/crop.entity';
import { useCases } from 'commons/crop/application/use-cases';
import { CropController } from 'commons/crop/interface/crop.controller';
import { infrastructure } from 'commons/crop/infrastructure';

@Module({
  imports: [TypeOrmModule.forFeature([CropEntity])],
  controllers: [CropController],
  providers: [...infrastructure, ...useCases],
  exports: [...infrastructure],
})
export class CropModule {}
