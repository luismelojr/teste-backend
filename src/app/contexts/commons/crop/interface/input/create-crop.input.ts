import { IsEnum, IsInt, IsOptional, Matches } from 'class-validator';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCropInput {
  @ApiProperty({ enum: CropTypeEnum, example: CropTypeEnum.SUMMER })
  @IsEnum(CropTypeEnum)
  type: CropTypeEnum;

  @ApiPropertyOptional({ example: 2025 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Matches(/^\d{4}$/, { message: 'O ano deve ter exatamente 4 dígitos' })
  start?: number;

  @ApiPropertyOptional({ example: 2026 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Matches(/^\d{4}$/, { message: 'O ano deve ter exatamente 4 dígitos' })
  end?: number;
}
