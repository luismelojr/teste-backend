import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'shared/types/uuid';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CityDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  uuid: UUID;
}

export class UpdateCompanyInput {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  uuid: UUID;

  @ApiProperty({ example: 'Patria LTDA' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '57667476000106' })
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Patria Agronegócio' })
  tradeName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '6299999999' })
  phone?: string;

  @ApiProperty({ type: [CityDto] })
  @IsOptional()
  @ValidateNested()
  @Type(() => CityDto)
  city?: CityDto;

  @ApiProperty({ example: 'Rua T674, quadra: 02, Lote: 04' })
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'patria@patria.com.br' })
  email?: string;
}
