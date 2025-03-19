import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UUID } from 'shared/types/uuid';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { CropCustomerStatusEnum } from 'enumerates/crop-customer-status.enum';

class GrainConsumerDto {
  @ApiProperty({ example: true })
  isConsumer: boolean;

  @ApiPropertyOptional({ example: false })
  isOwnGrain?: boolean;

  @ApiPropertyOptional({ example: true })
  isReceiveThirdGrains?: boolean;

  @ApiPropertyOptional({ example: 1000 })
  annualQuantity?: number;
}

class CoordinatesDto {
  @ApiProperty({ example: -23.55052 })
  lat: number;

  @ApiProperty({ example: -46.633308 })
  long: number;
}

class CustomerLocationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: UUID;

  @ApiProperty({ example: 'Fazenda X' })
  name: string;

  @ApiPropertyOptional({ example: 'Descrição da fazenda' })
  description?: string;

  @ApiPropertyOptional({ example: 'Endereço da fazenda' })
  address?: string;

  @ApiPropertyOptional({ type: CoordinatesDto })
  coordinates?: CoordinatesDto;

  @ApiPropertyOptional({ example: 500 })
  totalHectares?: number;
}

class ActivityDetailsDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: UUID;

  @ApiProperty({ example: 'Agricultura' })
  name: string;
}

class CustomerActivityDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: UUID;

  @ApiProperty({ type: ActivityDetailsDto })
  activity: ActivityDetailsDto;
}

class PersonDetailsDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: UUID;

  @ApiProperty({ example: 'John Doe' })
  name: string;
}

class OccupationDetailsDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: UUID;

  @ApiProperty({ example: 'Engenheiro Agrônomo' })
  name: string;
}

class CustomerPersonDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: UUID;

  @ApiProperty({ type: PersonDetailsDto })
  person: PersonDetailsDto;

  @ApiProperty({ type: OccupationDetailsDto })
  occupation: OccupationDetailsDto;
}

class CultivationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: UUID;

  @ApiProperty({ example: 'Milho Safrinha' })
  name: string;
}

class CustomerCultivationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: UUID;

  @ApiProperty({ type: CultivationDto })
  cultivation: CultivationDto;
}

class CustomerCropInformationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: UUID;

  @ApiProperty({ enum: CropTypeEnum, example: CropTypeEnum.SUMMER })
  typeCrop: CropTypeEnum;

  @ApiProperty({ example: '2025-01-01' })
  plantingSeasonStart: Date;

  @ApiProperty({ example: '2025-04-01' })
  plantingSeasonEnd: Date;

  @ApiProperty({ example: '2025-06-01' })
  harvestSeasonStart: Date;

  @ApiProperty({ example: '2025-09-01' })
  harvestSeasonEnd: Date;

  @ApiProperty({ type: [CustomerCultivationDto] })
  cultivations: CustomerCultivationDto[];
}

class CropDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: UUID;

  @ApiProperty({ example: 'Safra xxxx' })
  name: string;
}

class CustomerCropDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: UUID;

  @ApiProperty({ example: 'Plantação X' })
  identification: string;

  @ApiProperty({
    enum: CropCustomerStatusEnum,
    example: CropCustomerStatusEnum.PLANTED,
  })
  cropStatus: CropCustomerStatusEnum;

  @ApiProperty({ type: CultivationDto })
  cultivation: CultivationDto;

  @ApiProperty({ type: CropDto })
  crop: CropDto;

  @ApiPropertyOptional({ example: 'Safra de X' })
  description?: string;

  @ApiPropertyOptional({ example: '2025-01-01' })
  plantingDate?: Date;

  @ApiPropertyOptional({ example: '2025-01-01' })
  harvestDate?: Date;

  @ApiPropertyOptional({ example: 200 })
  plantedAreaHectares?: number;

  @ApiPropertyOptional({ example: 201 })
  averageProductivity?: number;

  @ApiPropertyOptional({ example: 202 })
  conservativeProductivity?: number;

  @ApiPropertyOptional({ example: 203 })
  expectedTotalProduction?: number;
}

export class CustomerOutput {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: UUID;

  @ApiProperty({ example: 'customer-123' })
  identifier: string;

  @ApiPropertyOptional({ example: 'group-123' })
  groupIdentifier?: string;

  @ApiPropertyOptional({ example: 'Customer description' })
  description?: string;

  @ApiPropertyOptional({ example: true })
  financialTools?: boolean;

  @ApiPropertyOptional({ example: false })
  receivesLandRent?: boolean;

  @ApiProperty({ type: GrainConsumerDto })
  grainConsumer: GrainConsumerDto;

  @ApiPropertyOptional({ type: [CustomerLocationDto] })
  locations?: CustomerLocationDto[];

  @ApiPropertyOptional({ type: [CustomerActivityDto] })
  activities?: CustomerActivityDto[];

  @ApiPropertyOptional({ type: [CustomerPersonDto] })
  persons?: CustomerPersonDto[];

  @ApiPropertyOptional({ type: [CustomerCropInformationDto] })
  cropInformation?: CustomerCropInformationDto[];

  @ApiPropertyOptional({ type: [CustomerCropDto] })
  crops?: CustomerCropDto[];
}
