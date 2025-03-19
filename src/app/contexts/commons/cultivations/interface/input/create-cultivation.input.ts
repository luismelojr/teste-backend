import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCultivationInput {
  @ApiProperty({ example: 'Soja' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Cultura de Soja' })
  description?: string;
}
