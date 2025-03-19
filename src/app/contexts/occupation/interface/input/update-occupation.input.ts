import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UUID } from 'shared/types/uuid';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOccupationInput {
  @IsNotEmpty()
  uuid: UUID;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Agrônomo' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Cargo Agrônomo' })
  description?: string;
}
