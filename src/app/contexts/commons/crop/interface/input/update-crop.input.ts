import { UUID } from 'shared/types/uuid';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateCropInput {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  uuid: UUID;

  @ApiProperty({ enum: CropTypeEnum, example: CropTypeEnum.SUMMER })
  @IsEnum(CropTypeEnum)
  type: CropTypeEnum;

  @ApiPropertyOptional({ example: 2025 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  start?: number;

  @ApiPropertyOptional({ example: 2026 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  end?: number;
}
