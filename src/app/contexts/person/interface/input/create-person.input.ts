import { PersonGenderType } from 'enumerates/person-gender-type';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'shared/types/uuid';

class CityDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  uuid: UUID;
}

export class CreatePersonInput {
  @ApiProperty({ example: 'João da silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '99999999999' })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({ example: '62999999999' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ type: [CityDto] })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CityDto)
  city?: CityDto;

  @ApiProperty({ example: 'Rua T674, quadra: 02, Lote: 04' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ enum: PersonGenderType, example: PersonGenderType.FEMALE })
  @IsEnum(PersonGenderType)
  @IsOptional()
  gender?: PersonGenderType;
}
