import { Customer } from 'customer/domain/customer';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { GeoCoordinates } from 'customer/domain/value-objects/geo-coordinates';
import { Activity } from 'customer/domain/value-objects/activity';
import { CustomerPerson } from 'customer/domain/aggregates/customer-person';
import { Person } from 'customer/domain/value-objects/person';
import { Occupation } from 'customer/domain/value-objects/occupation';
import {
  CustomerCropInformation,
} from 'customer/domain/aggregates/customer-crop-information';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { GrainConsumer } from 'customer/domain/value-objects/grain-consumer';
import { Cultivation } from 'customer/domain/value-objects/cultivation';
import { CustomerLocation } from 'customer/domain/aggregates/custumer-location';
import { CustomerActivity } from 'customer/domain/aggregates/customer-activity';
import { CropCustomerStatusEnum } from 'enumerates/crop-customer-status.enum';
import { CustomerCrop } from 'customer/domain/aggregates/customer-crop';

describe('Customer Domain', () => {
  let customer: Customer;

  beforeEach(() => {
    customer = new Customer({
      identifier: 'GROUP001',
      description: 'Grupo 001 - Cliente top',
      financialTools: true,
      receivesLandRent: true,
      grainConsumer: {
        isConsumer: true,
        isOwnGrain: true,
        isReceiveThirdGrains: true,
        annualQuantity: 500,
      },
      locations: [
        {
          id: '1',
          uuid: generateUuidV4(),
          name: 'Fazenda Boa Vista',
          description: 'Localização de Teste',
          address: 'Estrada 1000',
          coordinates: { lat: -23.55052, long: -46.633308 },
          totalHectares: 500,
        },
      ],
      activities: [
        {
          id: '1',
          uuid: generateUuidV4(),
          customerId: '1',
          activity: {
            id: '1',
            uuid: generateUuidV4(),
            name: 'Produtor grãos',
            description: 'Planta grãos',
          },

        },
      ],
      persons: [
        {
          id: '1',
          uuid: generateUuidV4(),
          customerId: '1',
          person: {
            id: '1',
            uuid: generateUuidV4(),
            name: 'João Silva',
            cpf: '12345678900',
            phone: '11999999999',
            cityName: 'São Paulo',
            nameState: 'SP',
          },
          occupation: {
            id: '1',
            uuid: generateUuidV4(),
            name: 'Gerente',
          },
        },
      ],
      cropInformation: [
        {
          id: '1',
          uuid: generateUuidV4(),
          customerId: '1',
          typeCrop: CropTypeEnum.SUMMER,
          plantingSeasonStart: new Date('2025-09-01'),
          plantingSeasonEnd: new Date('2025-12-01'),
          harvestSeasonStart: new Date('2026-03-01'),
          harvestSeasonEnd: new Date('2026-06-01'),
          cultivations: [
            {
              id: '1',
              uuid: generateUuidV4(),
              customerCropInformationId: '1',
              cultivation: {
                id: '1',
                uuid: generateUuidV4(),
                name: 'Soja',
                description: 'Cultivo de soja',
              },
            },
          ],
        },
      ],
      crops: [
        {
          uuid: generateUuidV4(),
          identification: 'Safra 2025',
          customerId: '1',
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
          cultivation: {
            id: '1',
            uuid: generateUuidV4(),
            name: 'Soja',
            description: 'Cultivo de soja',
          },
          crop: {
            id: '1',
            uuid: generateUuidV4(),
            name: 'Soja Safra 2025',
            type: CropTypeEnum.SUMMER,
          },
          locations: [{
            id: '1',
            uuid: generateUuidV4(),
            name: 'Fazenda Boa Vista',
          }],
        },
      ],
    });
  });

  it('should Customer to be defined', () => {
    expect(customer).toBeDefined();
  });
  it('should create a valid Customer', () => {
    expect(customer.identifier).toBe('GROUP001');
    expect(customer.description).toBe('Grupo 001 - Cliente top');
    expect(customer.financialTools).toBe(true);
    expect(customer.receivesLandRent).toBe(true);
    expect(customer.grainConsumer.isConsumer).toBe(true);
    expect(customer.locations.length).toBe(1);
    expect(customer.activities.length).toBe(1);
    expect(customer.persons.length).toBe(1);
    expect(customer.cropInformation.length).toBe(1);
  });

  it('should ensure correct typing of instantiated objects', () => {
    expect(typeof customer.identifier).toBe('string');
    expect(typeof customer.grainConsumer.isConsumer).toBe('boolean');
    expect(Array.isArray(customer.locations)).toBe(true);
    expect(Array.isArray(customer.activities)).toBe(true);
    expect(Array.isArray(customer.persons)).toBe(true);
    expect(Array.isArray(customer.cropInformation)).toBe(true);

    expect(typeof customer.locations[0].uuid).toBe('string');
    expect(typeof customer.locations[0].coordinates.lat).toBe('number');
    expect(typeof customer.locations[0].coordinates.long).toBe('number');

    expect(typeof customer.activities[0].uuid).toBe('string');
    expect(typeof customer.activities[0].activity.name).toBe('string');

    expect(typeof customer.persons[0].uuid).toBe('string');
    expect(typeof customer.persons[0].person.name).toBe('string');
    expect(typeof customer.persons[0].occupation.name).toBe('string');

    expect(typeof customer.cropInformation[0].uuid).toBe('string');
    expect(typeof customer.cropInformation[0].typeCrop).toBe('string');
    expect(customer.cropInformation[0].plantingSeasonStart instanceof Date).toBe(true);
    expect(customer.cropInformation[0].harvestSeasonStart instanceof Date).toBe(true);
  });

  describe('GrainConsumer', () => {
    it('should instantiate GrainConsumer correctly inside Customer', () => {
      expect(customer.grainConsumer).toBeInstanceOf(GrainConsumer);
      expect(customer.grainConsumer.isConsumer).toBe(true);
      expect(customer.grainConsumer.isOwnGrain).toBe(true);
      expect(customer.grainConsumer.isReceiveThirdGrains).toBe(true);
      expect(customer.grainConsumer.annualQuantity).toBe(500);
    });

    it('should validate GrainConsumer rules create correctly', () => {
      const grainConsumer = GrainConsumer.create({
        isConsumer: false,
        isOwnGrain: true,
        isReceiveThirdGrains: true,
        annualQuantity: 100,
      });

      expect(grainConsumer).toBeInstanceOf(GrainConsumer);
      expect(grainConsumer.isConsumer).toBe(false);
      expect(grainConsumer.isOwnGrain).toBe(false);
      expect(grainConsumer.isReceiveThirdGrains).toBe(false);
      expect(grainConsumer.annualQuantity).toBe(0);
    });
  });

  describe('CustomerLocation', () => {
    it('should validate CustomerLocation ', () => {
      expect(customer.locations[0]).toBeInstanceOf(CustomerLocation);
      expect(customer.locations[0].name).toBe('Fazenda Boa Vista');
      expect(customer.locations[0].description).toBe('Localização de Teste');
      expect(customer.locations[0].address).toBe('Estrada 1000');
      expect(customer.locations[0].totalHectares).toBe(500);

      expect(customer.locations[0].coordinates).toBeInstanceOf(GeoCoordinates);
      expect(customer.locations[0].coordinates.lat).toBe(-23.55052);
      expect(customer.locations[0].coordinates.long).toBe(-46.633308);
    });

    it('should validate GeoCoordinates correctly', () => {
      expect(() => new GeoCoordinates({ lat: -100, long: 50 })).toThrow();
      expect(() => new GeoCoordinates({ lat: 50, long: -200 })).toThrow();
    });
  });


  describe('CustomerPerson', () => {
    it('should validate CustomerPerson ', () => {
      expect(customer.persons[0]).toBeInstanceOf(CustomerPerson);
      expect(customer.persons[0].person).toBeInstanceOf(Person);
      expect(customer.persons[0].person.name).toBe('João Silva');
      expect(customer.persons[0].person.cityName).toBe('São Paulo');
      expect(customer.persons[0].person.nameState).toBe('SP');

      expect(customer.persons[0].occupation).toBeInstanceOf(Occupation);
      expect(customer.persons[0].occupation.name).toBe('Gerente');
    });

    it('should validate CustomerPerson occupation correctly', () => {
      const person = new Person({
        id: '2',
        uuid: generateUuidV4(),
        name: 'Maria Oliveira',
        cpf: '98765432100',
        phone: '11911112222',
        cityName: 'Rio de Janeiro',
        nameState: 'RJ',
      });
      const occupation = new Occupation({
        id: '2',
        uuid: generateUuidV4(),
        name: 'Supervisor',
      });

      const customerPerson = new CustomerPerson({
        id: '1',
        uuid: generateUuidV4(),
        person,
        occupation: occupation,
        customerId: '2',
      });
      expect(customerPerson.person.name).toBe('Maria Oliveira');
      expect(customerPerson.occupation.name).toBe('Supervisor');
    });
  });

  describe('CustomerCropInformation', () => {
    it('should validate CustomerCropInformation ', () => {
      expect(customer.cropInformation[0]).toBeInstanceOf(CustomerCropInformation);
      expect(customer.cropInformation[0].typeCrop).toBe(CropTypeEnum.SUMMER);
      expect(customer.cropInformation[0].plantingSeasonStart).toBeInstanceOf(Date);
      expect(customer.cropInformation[0].plantingSeasonEnd).toBeInstanceOf(Date);
      expect(customer.cropInformation[0].harvestSeasonStart).toBeInstanceOf(Date);
      expect(customer.cropInformation[0].harvestSeasonEnd).toBeInstanceOf(Date);
    });


    it('should validate cultivation is correct', () => {
      const custumerCropInfoCultivation = customer.cropInformation[0].cultivations[0];
      expect(custumerCropInfoCultivation.cultivation.name).toBe('Soja');
      expect(custumerCropInfoCultivation.cultivation.description).toBe('Cultivo de soja');
    });

    it('should validate exceptions when planting end before planting start', () => {
      expect(
        () =>
          new CustomerCropInformation({
            uuid: generateUuidV4(),
            customerId: '1',
            typeCrop: CropTypeEnum.THIRD,
            plantingSeasonStart: new Date('2026-06-01'),
            plantingSeasonEnd: new Date('2025-12-01'),
            harvestSeasonStart: new Date('2026-03-01'),
            harvestSeasonEnd: new Date('2026-06-01'),
            cultivations: [],
          }),
      ).toThrow('A data de início do plantio não pode ser posterior à data de término.');
    });

    it('should validate exceptions when harvest start after harvest end', () => {
      expect(
        () =>
          new CustomerCropInformation({
            uuid: generateUuidV4(),
            customerId: '1',
            typeCrop: CropTypeEnum.SECOND,
            plantingSeasonStart: new Date('2025-09-01'),
            plantingSeasonEnd: new Date('2025-12-01'),
            harvestSeasonStart: new Date('2026-07-01'),
            harvestSeasonEnd: new Date('2026-06-01'),
            cultivations: [],
          }),
      ).toThrow('A data de início da colheita não pode ser posterior à data de término.');
    });

    it('should validate exceptions when planting end after harvest start', () => {
      expect(
        () =>
          new CustomerCropInformation({
            uuid: generateUuidV4(),
            customerId: '1',
            typeCrop: CropTypeEnum.SUMMER,
            plantingSeasonStart: new Date('2025-09-01'),
            plantingSeasonEnd: new Date('2026-05-01'),
            harvestSeasonStart: new Date('2026-03-01'),
            harvestSeasonEnd: new Date('2026-06-01'),
            cultivations: [],
          }),
      ).toThrow('A data de término do plantio não pode ser posterior à data de início da colheita.');
    });

    it('should create a valid Cultivation instance', () => {
      const cultivation = new Cultivation({
        id: '4',
        uuid: generateUuidV4(),
        name: 'Cultivo Orgânico',
        description: 'Uso de técnicas naturais',
      });
      expect(cultivation.name).toBe('Cultivo Orgânico');
    });
  });

  describe('CustomerActivity', () => {
    it('should validate CustomerActivity ', () => {
      expect(customer.activities[0]).toBeInstanceOf(CustomerActivity);
      expect(customer.activities[0].activity).toBeInstanceOf(Activity);
      expect(customer.activities[0].activity.name).toBe('Produtor grãos');
      expect(customer.activities[0].activity.description).toBe('Planta grãos');
    });

    it('should create a valid Activity instance', () => {
      const activity = new Activity({
        id: '3',
        uuid: generateUuidV4(),
        name: 'Colheita',
        description: 'Colheita de milho',
      });
      expect(activity.name).toBe('Colheita');
    });
  });

  describe('CustomerCrop', () => {
    it('should create a valid CustomerCrop inside Customer', () => {
      expect(customer.crops.length).toBe(1);
      const crop = customer.crops[0];
      expect(crop).toBeInstanceOf(CustomerCrop);
      expect(crop.identification).toBe('Safra 2025');
      expect(crop.description).toBe('Safra de soja 2025');
      expect(crop.plantingDate).toBeInstanceOf(Date);
      expect(crop.harvestDate).toBeInstanceOf(Date);
      expect(crop.plantedAreaHectares).toBe(200);
      expect(crop.cropStatus).toBe(CropCustomerStatusEnum.PLANTED);
      expect(crop.cultivation.name).toBe('Soja');
      expect(crop.crop.name).toBe('Soja Safra 2025');
      expect(crop.locations[0].name).toBe('Fazenda Boa Vista');
    });
    it('should throw an error when planting date is after harvest date', () => {
      expect(
        () =>
          new CustomerCrop({
            uuid: generateUuidV4(),
            identification: 'Erro de Data',
            description: 'Teste de erro com datas inválidas',
            plantingDate: new Date('2026-05-01'),
            harvestDate: new Date('2026-04-01'),
            plantedAreaHectares: 100,
            averageProductivity: 50,
            conservativeProductivity: 40,
            expectedTotalProduction: 5000,
            nitrogenPercentage: 10,
            phosphorusPercentage: 5,
            potassiumPercentage: 7,
            ammoniumSulfatePercentage: 3,
            defensivePercentage: 2,
            seedPercentage: 8,
            totalSoldBags: 2500,
            totalSoldPercentage: 50,
            averageSalesValue: 20,
            cropStatus: CropCustomerStatusEnum.PLANTED,
            customerId: '1',
            cultivation: {
              id: '1',
              uuid: generateUuidV4(),
              name: 'Milho',
              description: 'Cultivo de milho',
            },
            crop: {
              id: '2',
              uuid: generateUuidV4(),
              name: 'Milho Safra 2026',
              type: CropTypeEnum.SUMMER,
            },
            locations: [{
              id: '1',
              uuid: generateUuidV4(),
              name: 'Fazenda Teste',
            }],
          }),
      ).toThrow('Planting date must be before harvest date.');
    });
  });

});
