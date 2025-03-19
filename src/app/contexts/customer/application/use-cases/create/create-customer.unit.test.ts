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
import {
  CreateCustomer,
} from 'customer/application/use-cases/create/create-customer';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  CustomerRelationFetch,
} from 'customer/application/use-cases/customer-relation-fetch';

describe('CreateCustomer UseCase', () => {
  let createCustomer: CreateCustomer;
  let customerRepository;
  let activityRepository;
  let cropRepository;
  let personRepository;
  let occupationRepository;
  let cultivationRepository;

  const command = {
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
        name: 'Farm 1',
        description: 'Main farm',
        address: '123 Main St',
        coordinates: { lat: -23.55, long: -46.63 },
        totalHectares: 500,
      },
    ],
    activities: [{ activity: { uuid: generateUuidV4(), name: 'Farming' } }],
    persons: [
      {
        person: { uuid: generateUuidV4(), name: 'John Doe' },
        occupation: { uuid: generateUuidV4(), name: 'Manager' },
      },
    ],
    cropInformation: [
      {
        typeCrop: CropTypeEnum.SUMMER,
        plantingSeasonStart: new Date('2025-09-01'),
        plantingSeasonEnd: new Date('2025-12-01'),
        harvestSeasonStart: new Date('2026-03-01'),
        harvestSeasonEnd: new Date('2026-06-01'),
        cultivations: [{
          cultivation: { uuid: generateUuidV4(), name: 'Corn' },
        }],
      },
    ],
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCustomer,
        CustomerRelationFetch,
        { provide: CustomerRepository, useValue: { create: jest.fn() } },
        { provide: ActivityRepository, useValue: { findOneByUuid: jest.fn() } },
        { provide: CropRepository, useValue: { findOneByUuid: jest.fn() } },
        { provide: PersonRepository, useValue: { findOneByUuid: jest.fn() } },
        {
          provide: OccupationRepository,
          useValue: { findOneByUuid: jest.fn() },
        },
        {
          provide: CultivationRepository,
          useValue: { findOneByUuid: jest.fn() },
        },
      ],
    }).compile();

    createCustomer = module.get<CreateCustomer>(CreateCustomer);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);
    activityRepository = module.get<ActivityRepository>(ActivityRepository);
    cropRepository = module.get<CropRepository>(CropRepository);
    personRepository = module.get<PersonRepository>(PersonRepository);
    occupationRepository = module.get<OccupationRepository>(OccupationRepository);
    cultivationRepository = module.get<CultivationRepository>(CultivationRepository);
  });

  it('should successfully create a customer', async () => {
    activityRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'activity-uuid',
      name: 'Farming',
    });
    personRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'person-uuid',
      name: {
        getValue: jest.fn().mockResolvedValue('John Doe'),
      },
    });
    occupationRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'occupation-uuid',
      name: 'Manager',
    });
    cultivationRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'cultivation-uuid',
      name: 'Corn',
    });
    cropRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'crop-uuid',
      name: 'Corn',
    });

    customerRepository.create.mockResolvedValue(savedCustomer);

    const result = await createCustomer.execute(command);

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

    expect(customerRepository.create).toHaveBeenCalledWith(expect.any(Customer));
  });

  it('should throw an error if an activity is not found', async () => {
    personRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'person-uuid',
      name: {
        getValue: jest.fn().mockResolvedValue('John Doe'),
      },
    });
    occupationRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'occupation-uuid',
      name: 'Manager',
    });
    cultivationRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'cultivation-uuid',
      name: 'Corn',
    });
    cropRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'crop-uuid',
      name: 'Corn',
    });

    activityRepository.findOneByUuid.mockResolvedValue(null);

    await expect(createCustomer.execute({
      ...command,
      activities: [{
        activity: {
          uuid: 'invalid-activity-uuid',
          name: 'Unknown',
        },
      }],
    })).rejects.toThrow('Activity not found');
  });

  it('should throw an error if a person is not found', async () => {
    activityRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'activity-uuid',
      name: 'Farming',
    });
    occupationRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'occupation-uuid',
      name: 'Manager',
    });
    cultivationRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'cultivation-uuid',
      name: 'Corn',
    });
    cropRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'crop-uuid',
      name: 'Corn',
    });

    personRepository.findOneByUuid.mockResolvedValue(null);

    await expect(createCustomer.execute({
      ...command,
      persons: [{
        person: { uuid: 'invalid-person-uuid', name: 'Unknown' },
        occupation: { uuid: generateUuidV4(), name: 'Manager' },
      }],
    })).rejects.toThrow('Person not found');
  });

  it('should throw an error if a occupation is not found', async () => {
    activityRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'activity-uuid',
      name: 'Farming',
    });
    personRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'person-uuid',
      name: {
        getValue: jest.fn().mockResolvedValue('John Doe'),
      },
    });
    cultivationRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'cultivation-uuid',
      name: 'Corn',
    });
    cropRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'crop-uuid',
      name: 'Corn',
    });

    occupationRepository.findOneByUuid.mockResolvedValue(null);

    await expect(createCustomer.execute({
      ...command,
      persons: [{
        person: { uuid: generateUuidV4(), name: 'John Doe' },
        occupation: { uuid: 'invalid-person-uuid', name: 'Unknown' },
      }],
    })).rejects.toThrow('Occupation not found');
  });

  it('should throw an error if a Cultivation is not found in cropInformation', async () => {
    activityRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'activity-uuid',
      name: 'Farming',
    });
    personRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'person-uuid',
      name: {
        getValue: jest.fn().mockResolvedValue('John Doe'),
      },
    });
    occupationRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'occupation-uuid',
      name: 'Manager',
    });
    cropRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'crop-uuid',
      name: 'Corn',
    });

    cultivationRepository.findOneByUuid.mockResolvedValue(null);

    await expect(createCustomer.execute({
      ...command,
      cropInformation: [
        {
          typeCrop: CropTypeEnum.SUMMER,
          plantingSeasonStart: new Date('2025-09-01'),
          plantingSeasonEnd: new Date('2025-12-01'),
          harvestSeasonStart: new Date('2026-03-01'),
          harvestSeasonEnd: new Date('2026-06-01'),
          cultivations: [{
            cultivation: {
              uuid: 'invalid-uuid',
              name: 'Unknown',
            },
          }],
        },
      ],
    })).rejects.toThrow('Cultivation not found');
  });

  it('should throw an error if a Cultivation is not found in crop', async () => {
    activityRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'activity-uuid',
      name: 'Farming',
    });
    personRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'person-uuid',
      name: {
        getValue: jest.fn().mockResolvedValue('John Doe'),
      },
    });
    occupationRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'occupation-uuid',
      name: 'Manager',
    });
    cropRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'crop-uuid',
      name: 'Corn',
    });

    cultivationRepository.findOneByUuid.mockResolvedValue(null);

    await expect(createCustomer.execute({
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
    activityRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'activity-uuid',
      name: 'Farming',
    });
    personRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'person-uuid',
      name: {
        getValue: jest.fn().mockResolvedValue('John Doe'),
      },
    });
    cultivationRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'cultivation-uuid',
      name: 'Corn',
    });
    occupationRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: 'occupation-uuid',
      name: 'Manager',
    });
    cropRepository.findOneByUuid.mockResolvedValue(null);

    await expect(createCustomer.execute({
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

});
