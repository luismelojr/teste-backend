import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UUID } from 'shared/types/uuid';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventTypeInput {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  uuid: UUID;

  @ApiProperty({ example: 'Produtor rural' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Realiza plantios' })
  description?: string;
}
