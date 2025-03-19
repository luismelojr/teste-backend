import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { CropCustomerStatusEnum } from 'enumerates/crop-customer-status.enum';

export const customer = {
  identifier: 'GROUP001',
  groupIdentifier: 'GROUP001',
  description: 'Grupo 001 - Cliente top',
  financialTools: true,
  receivesLandRent: true,
  grainConsumer: {
    isConsumer: true,
    isOwnGrain: true,
    isReceiveThirdGrains: true,
    annualQuantity: 500,
  },
};


export const location = {
  name: 'Fazenda Boa Vista',
  description: 'Localização de Teste',
  address: 'Estrada 1000',
  coordinates: { lat: -23.55052, long: -46.633308 },
  totalHectares: 500,
};


export const cropInformation = {
  typeCrop: CropTypeEnum.SUMMER,
  plantingSeasonStart: new Date('2025-09-01'),
  plantingSeasonEnd: new Date('2025-12-01'),
  harvestSeasonStart: new Date('2026-03-01'),
  harvestSeasonEnd: new Date('2026-06-01'),
};

export const crop = {
  identification: 'Safra 2025',
  cropStatus: CropCustomerStatusEnum.PLANTED,
  description: 'Safra de soja 2025',
  plantingDate: new Date('2025-09-15'),
  harvestDate: new Date('2026-03-20'),
  plantedAreaHectares: 200,
  averageProductivity: 50,
  conservativeProductivity: 40,
  expectedTotalProduction: 10000,
  nitrogenPercentage: 10,
  phosphorusPercentage: 5,
  potassiumPercentage: 7,
  ammoniumSulfatePercentage: 3,
  defensivePercentage: 2,
  seedPercentage: 8,
  totalSoldBags: 5000,
  totalSoldPercentage: 50,
  averageSalesValue: 20,
};
