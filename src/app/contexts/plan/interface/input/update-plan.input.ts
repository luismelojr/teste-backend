import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'shared/types/uuid';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class FunctionsDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  uuid: UUID;

  @ApiProperty({ example: 'Recebimento de Climas' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Recebe informações de climas da localidade da fazenda' })
  description?: string;
}

export class UpdatePlanInput {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  uuid: UUID;

  @ApiProperty({ example: 'Plano rural 50%' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Plano de 50% para grandes fazendas' })
  description?: string;

  @ApiPropertyOptional({ type: [FunctionsDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FunctionsDto)
  functions?: FunctionsDto[];
}
