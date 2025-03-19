import { UUID } from 'shared/types/uuid';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { CropCustomerStatusEnum } from 'enumerates/crop-customer-status.enum';

export interface UpdateCustomerCommand {
  uuid: UUID;
  identifier: string;
  groupIdentifier?: string;
  description?: string;
  financialTools?: boolean;
  receivesLandRent?: boolean;
  grainConsumer: {
    isConsumer: boolean;
    isOwnGrain?: boolean;
    isReceiveThirdGrains?: boolean;
    annualQuantity?: number;
  };
  locations?: {
    uuid?: UUID;
    name: string;
    description?: string;
    address?: string;
    coordinates?: {
      lat: number;
      long: number;
    };
    totalHectares?: number;
  }[];
  activities?: {
    uuid?: UUID;
    activity: {
      uuid: UUID;
      name: string;
    }
  }[];
  persons?: {
    uuid?: UUID;
    person: {
      uuid: UUID;
      name: string;
    };
    occupation: {
      uuid: UUID;
      name: string;
    };
  }[];
  cropInformation?: {
    uuid?: UUID,
    typeCrop: CropTypeEnum;
    plantingSeasonStart: Date;
    plantingSeasonEnd: Date;
    harvestSeasonStart: Date;
    harvestSeasonEnd: Date;
    cultivations: {
      uuid: UUID;
      cultivation: {
        uuid: UUID;
        name: string;
      }
    }[];
  }[];
  crops?: {
    uuid?: UUID;
    identification: string;
    cropStatus: CropCustomerStatusEnum;
    description?: string;
    plantingDate?: Date;
    harvestDate?: Date;
    plantedAreaHectares?: number;
    averageProductivity?: number;
    conservativeProductivity?: number;
    expectedTotalProduction?: number;
    nitrogenPercentage?: number;
    phosphorusPercentage?: number;
    potassiumPercentage?: number;
    ammoniumSulfatePercentage?: number;
    defensivePercentage?: number;
    seedPercentage?: number;
    totalSoldBags?: number;
    totalSoldPercentage?: number;
    averageSalesValue?: number;
    cultivation: {
      uuid: UUID;
      name: string;
    };
    crop: {
      uuid: UUID;
      name: string;
    };
  }[];
}
