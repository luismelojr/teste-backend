import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOccupationInput {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Agrônomo' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Cargo Agrônomo' })
  description?: string;
}
