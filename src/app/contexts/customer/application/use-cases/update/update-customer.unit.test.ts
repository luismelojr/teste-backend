import { Test, TestingModule } from '@nestjs/testing';
import {
  CustomerRepository,
} from 'customer/infrastructure/customer.repository';
import {
  ActivityRepository,
} from 'activity/infrastructure/activity.repository';
import { CropRepository } from 'commons/crop/infrastructure/crop.repository';
import { PersonRepository } from 'person/infrastructure/person.repository';
import {
  OccupationRepository,
} from 'occupation/infrastructure/occupation.repository';
import {
  CultivationRepository,
} from 'commons/cultivations/infrastructure/cultivation.repository';
import { Customer } from 'customer/domain/customer';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { CropCustomerStatusEnum } from 'enumerates/crop-customer-status.enum';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  CustomerRelationFetch,
} from 'customer/application/use-cases/customer-relation-fetch';
import {
  CustomerLocationRepository,
} from 'customer/infrastructure/customer-location.repository';
import {
  UpdateCustomer,
} from 'customer/application/use-cases/update/update-customer';
import { CustomerLocation } from 'customer/domain/aggregates/custumer-location';

describe('UpdateCustomer UseCase', () => {
  let updatedCustomer: UpdateCustomer;
  let customerRepository;
  let locationRepository;
  let activityRepository;
  let cropRepository;
  let personRepository;
  let occupationRepository;
  let cultivationRepository;

  const customerActivity = {
    uuid: generateUuidV4(),
    activity: {
      uuid: generateUuidV4(),
      name: 'Farming',
    },
  };

  const customerPerson = {
    uuid: generateUuidV4(),
    person: { uuid: generateUuidV4(), name: 'John Doe' },
    occupation: { uuid: generateUuidV4(), name: 'Manager' },
  };

  const customerCropInformationCultivation = {
    uuid: generateUuidV4(),
    cultivation: {
      uuid: generateUuidV4(),
      name: 'Corn',
    },
  };

  const customerCropInformation = {
    typeCrop: CropTypeEnum.SUMMER,
    plantingSeasonStart: new Date('2025-09-01'),
    plantingSeasonEnd: new Date('2025-12-01'),
    harvestSeasonStart: new Date('2026-03-01'),
    harvestSeasonEnd: new Date('2026-06-01'),
    cultivations: [{ ...customerCropInformationCultivation }],
  };


  const command = {
    uuid: generateUuidV4(),
    identifier: 'CUST-001',
    groupIdentifier: 'GROUP-001',
    description: 'Customer Test',
    financialTools: true,
    receivesLandRent: false,
    grainConsumer: {
      isConsumer: true,
      isOwnGrain: false,
      isReceiveThirdGrains: false,
      annualQuantity: 1000,
    },
    locations: [
      {
        uuid: generateUuidV4(),
        name: 'Farm 1',
        description: 'Main farm',
        address: '123 Main St',
        coordinates: { lat: -23.55, long: -46.63 },
        totalHectares: 500,
      },
    ],
    activities: [{
      ...customerActivity,
    }],
    persons: [
      {
        ...customerPerson,
      },
    ],
    cropInformation: [
      {
        ...customerCropInformation,
      },
    ],
    crops: [
      {
        identification: 'CROP-123',
        cropStatus: CropCustomerStatusEnum.PLANTED,
        description: 'Corn crop',
        plantingDate: new Date('2025-09-01'),
        harvestDate: new Date('2026-06-01'),
        plantedAreaHectares: 100,
        averageProductivity: 50,
        conservativeProductivity: 40,
        expectedTotalProduction: 5000,
        nitrogenPercentage: 2.5,
        phosphorusPercentage: 1.2,
        potassiumPercentage: 0.8,
        ammoniumSulfatePercentage: 0.5,
        defensivePercentage: 0.3,
        seedPercentage: 0.2,
        totalSoldBags: 1000,
        totalSoldPercentage: 80,
        averageSalesValue: 200,
        cultivation: { uuid: generateUuidV4(), name: 'Corn' },
        crop: { uuid: generateUuidV4(), name: 'Corn' },
      },
    ],
  };

  const savedCustomer = new Customer({
    id: '1',
    uuid: generateUuidV4(),
    identifier: 'CUST-001',
    groupIdentifier: 'GROUP-001',
    description: 'Customer Test',
    financialTools: true,
    receivesLandRent: false,
    grainConsumer: {
      isConsumer: true,
      isOwnGrain: false,
      isReceiveThirdGrains: false,
      annualQuantity: 1000,
    },
    locations: [],
    activities: [],
    persons: [],
    cropInformation: [],
    crops: [],
  });

  const savedCustomerLocation = new CustomerLocation({
      id: '1',
      uuid: generateUuidV4(),
      name: 'Fazenda Boa Vista',
      description: 'Localização de Teste',
      address: 'Estrada 1000',
      coordinates: { lat: -23.55052, long: -46.633308 },
      totalHectares: 500,
    },
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCustomer,
        CustomerRelationFetch,
        {
          provide: CustomerRepository,
          useValue: {
            update: jest.fn(),
            findOneByUuid: jest.fn().mockResolvedValue(savedCustomer),
            findCustomerActivityByUuid: jest.fn().mockResolvedValue(customerActivity),
            findCustomerPersonByUuid: jest.fn().mockResolvedValue(customerPerson),
            findCustomerCropInformationByUuid: jest.fn().mockResolvedValue(customerCropInformation),
            findCustomerCropInfoCultivationByUuid: jest.fn().mockResolvedValue(customerCropInformationCultivation),
            findCustomerCropByUuid: jest.fn(),
          },
        },
        {
          provide: CustomerLocationRepository,
          useValue: { findOneByUuid: jest.fn().mockResolvedValue(savedCustomerLocation) },
        },
        {
          provide: ActivityRepository, useValue: {
            findOneByUuid: jest.fn().mockResolvedValue({
              id: '1',
              uuid: 'activity-uuid',
              name: 'Farming',
            }),
          },
        },
        {
          provide: CropRepository, useValue: {
            findOneByUuid: jest.fn().mockResolvedValue({
              id: '1',
              uuid: 'crop-uuid',
              name: 'Corn',
            }),
          },
        },
        {
          provide: PersonRepository, useValue: {
            findOneByUuid: jest.fn().mockResolvedValue({
              id: '1',
              uuid: 'person-uuid',
              name: {
                getValue: jest.fn().mockResolvedValue('John Doe'),
              },
            }),
          },
        },
        {
          provide: OccupationRepository,
          useValue: {
            findOneByUuid: jest.fn().mockResolvedValue({
              id: '1',
              uuid: 'occupation-uuid',
              name: 'Manager',
            }),
          },
        },
        {
          provide: CultivationRepository,
          useValue: {
            findOneByUuid: jest.fn().mockResolvedValue({
              id: '1',
              uuid: 'cultivation-uuid',
              name: 'Corn',
            }),
          },
        },
      ],
    }).compile();

    updatedCustomer = module.get<UpdateCustomer>(UpdateCustomer);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);
    locationRepository = module.get<CustomerLocationRepository>(CustomerLocationRepository);
    activityRepository = module.get<ActivityRepository>(ActivityRepository);
    cropRepository = module.get<CropRepository>(CropRepository);
    personRepository = module.get<PersonRepository>(PersonRepository);
    occupationRepository = module.get<OccupationRepository>(OccupationRepository);
    cultivationRepository = module.get<CultivationRepository>(CultivationRepository);
  });

  it('should successfully update a customer', async () => {
    customerRepository.update.mockResolvedValue(savedCustomer);

    const result = await updatedCustomer.execute(command);

    expect(result.uuid).toBe(savedCustomer.uuid);
    expect(result.identifier).toBe(savedCustomer.identifier);
    expect(result.groupIdentifier).toBe(savedCustomer.groupIdentifier);
    expect(result.description).toBe(savedCustomer.description);
    expect(result.financialTools).toBe(savedCustomer.financialTools);
    expect(result.receivesLandRent).toBe(savedCustomer.receivesLandRent);
    expect(result.grainConsumer.isConsumer).toBe(savedCustomer.grainConsumer.isConsumer);
    expect(result.grainConsumer.isOwnGrain).toBe(savedCustomer.grainConsumer.isOwnGrain);
    expect(result.grainConsumer.isReceiveThirdGrains).toBe(savedCustomer.grainConsumer.isReceiveThirdGrains);
    expect(result.grainConsumer.annualQuantity).toBe(savedCustomer.grainConsumer.annualQuantity);

    expect(locationRepository.findOneByUuid).toHaveBeenCalledWith(command.locations[0].uuid);

    expect(customerRepository.findOneByUuid).toHaveBeenCalledWith(command.uuid);
    expect(customerRepository.update).toHaveBeenCalledWith(expect.any(Customer));
  });

  it('should successfully update a customer when has a new location', async () => {
    customerRepository.update.mockResolvedValue(savedCustomer);

    const updatedCommand = {
      ...command,
      locations: [
        {
          uuid: generateUuidV4(),
          name: 'Farm 1',
          description: 'Main farm',
          address: '123 Main St',
          coordinates: { lat: -23.55, long: -46.63 },
          totalHectares: 500,
        },
        {
          name: 'Farm 1',
          description: 'Main farm',
          address: '123 Main St',
          coordinates: { lat: -23.55, long: -46.63 },
          totalHectares: 500,
        },
      ],
    };

    const result = await updatedCustomer.execute(updatedCommand);
    expect(result.uuid).toBe(savedCustomer.uuid);

    expect(locationRepository.findOneByUuid).toHaveBeenCalledWith(updatedCommand.locations[0].uuid);
    expect(locationRepository.findOneByUuid).toBeCalledTimes(1);

    expect(customerRepository.findOneByUuid).toHaveBeenCalledWith(command.uuid);
    expect(customerRepository.update).toHaveBeenCalledWith(expect.any(Customer));
  });

  it('should throw an error if an customer activity is not found in update', async () => {
    customerRepository.findCustomerActivityByUuid.mockResolvedValue(null);

    await expect(updatedCustomer.execute({
      ...command,
      activities: [{
        uuid: 'invalid-activity-uuid',
        activity: { uuid: 'invalid-activity-uuid', name: 'Unknown' },
      }],
    })).rejects.toThrow('Customer activity not found');
  });

  it('should throw an error if an activity is not found in update', async () => {
    activityRepository.findOneByUuid.mockResolvedValueOnce(null);

    await expect(updatedCustomer.execute({
      ...command,
      activities: [{
        uuid: 'invalid-activity-uuid',
        activity: { uuid: 'invalid-activity-uuid', name: 'Unknown' },
      }],
    })).rejects.toThrow('Activity not found');
  });

  it('should throw an error if a customer person is not found in update', async () => {
    customerRepository.findCustomerPersonByUuid.mockResolvedValue(null);

    await expect(updatedCustomer.execute({
      ...command,
      persons: [{
        uuid: 'invalid-person-uuid',
        person: { uuid: 'invalid-person-uuid', name: 'Unknown' },
        occupation: { uuid: generateUuidV4(), name: 'Manager' },
      }],
    })).rejects.toThrow('Customer person not found');
  });

  it('should throw an error if a person is not found in update', async () => {
    personRepository.findOneByUuid.mockResolvedValue(null);

    await expect(updatedCustomer.execute({
      ...command,
      persons: [{
        person: { uuid: 'invalid-person-uuid', name: 'Unknown' },
        occupation: { uuid: generateUuidV4(), name: 'Manager' },
      }],
    })).rejects.toThrow('Person not found');
  });

  it('should throw an error if a occupation is not found', async () => {
    occupationRepository.findOneByUuid.mockResolvedValueOnce(null);

    await expect(updatedCustomer.execute({
      ...command,
      persons: [{
        person: { uuid: generateUuidV4(), name: 'John Doe' },
        occupation: { uuid: 'invalid-person-uuid', name: 'Unknown' },
      }],
    })).rejects.toThrow('Occupation not found');
  });

  it('should throw an error if a customer cropInformation is not found', async () => {
    customerRepository.findCustomerCropInformationByUuid.mockResolvedValueOnce(null);

    await expect(updatedCustomer.execute({
      ...command,
      cropInformation: [
        {
          uuid: 'invalid-uuid',
          typeCrop: CropTypeEnum.SUMMER,
          plantingSeasonStart: new Date('2025-09-01'),
          plantingSeasonEnd: new Date('2025-12-01'),
          harvestSeasonStart: new Date('2026-03-01'),
          harvestSeasonEnd: new Date('2026-06-01'),
          cultivations: [{
            uuid: generateUuidV4(),
            cultivation: {
              uuid: generateUuidV4(), name: 'Soja',
            },
          }],
        },
      ],
    })).rejects.toThrow('Customer crop information not found');
  });

  it('should throw an error if a Cultivation is not found in cropInformation', async () => {
    cultivationRepository.findOneByUuid.mockResolvedValueOnce(null);

    await expect(updatedCustomer.execute({
      ...command,
      cropInformation: [
        {
          typeCrop: CropTypeEnum.SUMMER,
          plantingSeasonStart: new Date('2025-09-01'),
          plantingSeasonEnd: new Date('2025-12-01'),
          harvestSeasonStart: new Date('2026-03-01'),
          harvestSeasonEnd: new Date('2026-06-01'),
          cultivations: [{
            uuid: 'invalid-uuid',
            cultivation: {
              uuid: 'invalid-uuid', name: 'Unknown',
            },
          }],
        },
      ],
    })).rejects.toThrow('Cultivation not found');
  });

  it('should throw an error if a Cultivation is not found in crop', async () => {
    cultivationRepository.findOneByUuid.mockResolvedValueOnce(null);

    await expect(updatedCustomer.execute({
      ...command,
      crops: [
        {
          identification: 'CROP-123',
          cropStatus: CropCustomerStatusEnum.PLANTED,
          cultivation: { uuid: 'invalid-uuid', name: 'Unknown' },
          description: 'Corn crop',
          plantingDate: new Date('2025-09-01'),
          harvestDate: new Date('2026-06-01'),
          plantedAreaHectares: 100,
          averageProductivity: 50,
          conservativeProductivity: 40,
          expectedTotalProduction: 5000,
          nitrogenPercentage: 2.5,
          phosphorusPercentage: 1.2,
          potassiumPercentage: 0.8,
          ammoniumSulfatePercentage: 0.5,
          defensivePercentage: 0.3,
          seedPercentage: 0.2,
          totalSoldBags: 1000,
          totalSoldPercentage: 80,
          averageSalesValue: 200,
          crop: { uuid: generateUuidV4(), name: 'Corn' },
        },
      ],
    })).rejects.toThrow('Cultivation not found');
  });
  it('should throw an error if a Crop is not found in crop', async () => {
    cropRepository.findOneByUuid.mockResolvedValueOnce(null);

    await expect(updatedCustomer.execute({
      ...command,
      crops: [
        {
          identification: 'CROP-123',
          cropStatus: CropCustomerStatusEnum.PLANTED,
          cultivation: { uuid: generateUuidV4(), name: 'Corn' },
          description: 'Corn crop',
          plantingDate: new Date('2025-09-01'),
          harvestDate: new Date('2026-06-01'),
          plantedAreaHectares: 100,
          averageProductivity: 50,
          conservativeProductivity: 40,
          expectedTotalProduction: 5000,
          nitrogenPercentage: 2.5,
          phosphorusPercentage: 1.2,
          potassiumPercentage: 0.8,
          ammoniumSulfatePercentage: 0.5,
          defensivePercentage: 0.3,
          seedPercentage: 0.2,
          totalSoldBags: 1000,
          totalSoldPercentage: 80,
          averageSalesValue: 200,
          crop: { uuid: 'invalid-uuid', name: 'Unknown' },
        },
      ],
    })).rejects.toThrow('Crop not found');
  });

  it('should throw an error if a Customer Crop is not found in crop', async () => {
    customerRepository.findCustomerCropByUuid.mockResolvedValueOnce(null);

    await expect(updatedCustomer.execute({
      ...command,
      crops: [
        {
          uuid: 'invalid-uuid',
          identification: 'CROP-123',
          cropStatus: CropCustomerStatusEnum.PLANTED,
          cultivation: { uuid: generateUuidV4(), name: 'Corn' },
          description: 'Corn crop',
          plantingDate: new Date('2025-09-01'),
          harvestDate: new Date('2026-06-01'),
          plantedAreaHectares: 100,
          averageProductivity: 50,
          conservativeProductivity: 40,
          expectedTotalProduction: 5000,
          nitrogenPercentage: 2.5,
          phosphorusPercentage: 1.2,
          potassiumPercentage: 0.8,
          ammoniumSulfatePercentage: 0.5,
          defensivePercentage: 0.3,
          seedPercentage: 0.2,
          totalSoldBags: 1000,
          totalSoldPercentage: 80,
          averageSalesValue: 200,
          crop: { uuid: generateUuidV4(), name: 'Safra da boa' },
        },
      ],
    })).rejects.toThrow('Customer crop not found');
  });

});
