import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityInput {
  @ApiProperty({ example: 'Produtor rural' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Realiza plantios' })
  description?: string;
}
