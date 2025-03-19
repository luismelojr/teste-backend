import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UUID } from 'shared/types/uuid';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { CropCustomerStatusEnum } from 'enumerates/crop-customer-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

class GrainConsumerDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isConsumer: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isOwnGrain?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isReceiveThirdGrains?: boolean;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsNumber()
  annualQuantity?: number;
}

class CoordinatesDto {
  @ApiProperty({ example: -23.55052 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: -46.633308 })
  @IsNumber()
  long: number;
}

class ActivityDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  uuid: UUID;

  @ApiProperty({ example: 'Agricultura' })
  @IsString()
  name: string;
}

class PersonDetailsDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  uuid: UUID;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;
}

class CustomerActivityDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  uuid?: UUID;

  @ApiProperty({ type: 'object' })
  @ValidateNested()
  @Type(() => ActivityDto)
  activity: ActivityDto;
}

class CustomerLocationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsString()
  uuid?: UUID;

  @ApiProperty({ example: 'Fazenda X' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Descrição da fazenda' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Endereço da fazenda' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    type: 'object',
    example: { lat: -23.55052, long: -46.633308 },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  totalHectares?: number;
}

class OccupationDetailsDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  uuid: UUID;

  @ApiProperty({ example: 'Engenheiro Agrônomo' })
  @IsString()
  name: string;
}

class CustomerPersonDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsString()
  uuid?: UUID;

  @ApiProperty({ type: PersonDetailsDto })
  @ValidateNested()
  @Type(() => PersonDetailsDto)
  person: PersonDetailsDto;

  @ApiProperty({ type: OccupationDetailsDto })
  @ValidateNested()
  @Type(() => OccupationDetailsDto)
  occupation: OccupationDetailsDto;
}

class CultivationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  uuid: UUID;

  @ApiProperty({ example: 'Milho Safrinha' })
  @IsString()
  name: string;
}

class CustumerCropInfoCultivationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  uuid: UUID;

  @ApiProperty({ type: CultivationDto })
  @ValidateNested()
  @Type(() => CultivationDto)
  cultivation: CultivationDto;
}

class CustomerCropInformationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsString()
  uuid?: UUID;

  @ApiProperty({ enum: CropTypeEnum, example: CropTypeEnum.SUMMER })
  @IsEnum(CropTypeEnum)
  typeCrop: CropTypeEnum;

  @ApiProperty({ example: '2025-01-01' })
  @IsDate()
  @Type(() => Date)
  plantingSeasonStart: Date;

  @ApiProperty({ example: '2025-04-01' })
  @IsDate()
  @Type(() => Date)
  plantingSeasonEnd: Date;

  @ApiProperty({ example: '2025-06-01' })
  @IsDate()
  @Type(() => Date)
  harvestSeasonStart: Date;

  @ApiProperty({ example: '2025-09-01' })
  @IsDate()
  @Type(() => Date)
  harvestSeasonEnd: Date;

  @ApiProperty({ type: [CustumerCropInfoCultivationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustumerCropInfoCultivationDto)
  cultivations: CustumerCropInfoCultivationDto[];
}

class CropDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  uuid: UUID;

  @ApiProperty({ example: 'Safra xxxx' })
  @IsString()
  name: string;
}

class CustomerCropDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsString()
  uuid?: UUID;

  @ApiProperty({ example: 'Plantação X' })
  @IsString()
  identification: string;

  @ApiProperty({
    enum: CropCustomerStatusEnum,
    example: CropCustomerStatusEnum.PLANTED,
  })
  @IsEnum(CropCustomerStatusEnum)
  cropStatus: CropCustomerStatusEnum;

  @ApiProperty({
    type: 'object',
    example: {
      uuid: generateUuidV4(),
      name: 'Soja',
    },
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CultivationDto)
  cultivation: CultivationDto;

  @ApiPropertyOptional({ example: 'Safra de X' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  plantingDate?: Date;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  harvestDate?: Date;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @IsNumber()
  plantedAreaHectares?: number;

  @ApiPropertyOptional({ example: 201 })
  @IsOptional()
  @IsNumber()
  averageProductivity?: number;

  @ApiPropertyOptional({ example: 202 })
  @IsOptional()
  @IsNumber()
  conservativeProductivity?: number;

  @ApiPropertyOptional({ example: 203 })
  @IsOptional()
  @IsNumber()
  expectedTotalProduction?: number;

  @ApiPropertyOptional({ example: 204 })
  @IsOptional()
  @IsNumber()
  nitrogenPercentage?: number;

  @ApiPropertyOptional({ example: 205 })
  @IsOptional()
  @IsNumber()
  phosphorusPercentage?: number;

  @ApiPropertyOptional({ example: 206 })
  @IsOptional()
  @IsNumber()
  potassiumPercentage?: number;

  @ApiPropertyOptional({ example: 207 })
  @IsOptional()
  @IsNumber()
  ammoniumSulfatePercentage?: number;

  @ApiPropertyOptional({ example: 208 })
  @IsOptional()
  @IsNumber()
  defensivePercentage?: number;

  @ApiPropertyOptional({ example: 209 })
  @IsOptional()
  @IsNumber()
  seedPercentage?: number;

  @ApiPropertyOptional({ example: 210 })
  @IsOptional()
  @IsNumber()
  totalSoldBags?: number;

  @ApiPropertyOptional({ example: 211 })
  @IsOptional()
  @IsNumber()
  totalSoldPercentage?: number;

  @ApiPropertyOptional({ example: 212 })
  @IsOptional()
  @IsNumber()
  averageSalesValue?: number;

  @ApiProperty({ type: [CropDto] })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CropDto)
  crop: CropDto;
}

export class UpdateCustomerInput {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  uuid: UUID;

  @ApiProperty({ example: 'Cliente 001' })
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @ApiPropertyOptional({ example: 'group-123' })
  @IsOptional()
  @IsString()
  groupIdentifier?: string;

  @ApiPropertyOptional({ example: 'Customer description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  financialTools?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  receivesLandRent?: boolean;

  @ApiProperty({
    type: 'object',
    example: {
      isConsumer: true,
      isOwnGrain: false,
      isReceiveThirdGrains: true,
      annualQuantity: 1000,
    },
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GrainConsumerDto)
  grainConsumer: GrainConsumerDto;

  @ApiPropertyOptional({ type: [CustomerLocationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomerLocationDto)
  locations?: CustomerLocationDto[];

  @ApiPropertyOptional({ type: [CustomerActivityDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomerActivityDto)
  activities?: CustomerActivityDto[];

  @ApiPropertyOptional({ type: [CustomerPersonDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomerPersonDto)
  persons?: CustomerPersonDto[];

  @ApiPropertyOptional({ type: [CustomerCropInformationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomerCropInformationDto)
  cropInformation?: CustomerCropInformationDto[];

  @ApiPropertyOptional({ type: [CustomerCropDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomerCropDto)
  crops?: CustomerCropDto[];
}


