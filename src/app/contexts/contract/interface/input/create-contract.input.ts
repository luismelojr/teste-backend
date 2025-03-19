import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UUID } from 'shared/types/uuid';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PlanDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  uuid: UUID;

  @ApiProperty({ example: 'Plano rural 50%' })
  @IsString()
  @IsOptional()
  name?: string;
}

class CompanyDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  uuid: UUID;

  @ApiProperty({ example: 'Empresa de teste' })
  @IsString()
  @IsOptional()
  name?: string;
}

class PersonDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  uuid: UUID;

  @ApiProperty({ example: 'Pessoa de teste' })
  @IsString()
  @IsOptional()
  name?: string;
}

export class CreateContractInput {
  @ApiProperty({ example: 'Identificador do contrato' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'Descrição do contrato' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2021-01-01' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2021-12-31' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ type: [PlanDto] })
  @ValidateNested()
  @Type(() => PlanDto)
  @IsNotEmpty()
  plan: PlanDto;

  @ApiPropertyOptional({ type: [CompanyDto] })
  @ValidateNested()
  @Type(() => CompanyDto)
  @IsOptional()
  @ValidateIf((o) => !o.person)
  company?: CompanyDto;

  @ApiPropertyOptional({ type: [PersonDto] })
  @ValidateNested()
  @Type(() => PersonDto)
  @IsOptional()
  @ValidateIf((o) => !o.company)
  person?: PersonDto;
}
