import {
  IntegrationTestContext,
  setupIntegrationTest,
} from 'shared/test-helpers/test-integration-setup.helper';
import {
  CustomerRepository,
} from 'customer/infrastructure/customer.repository';
import {
  crop,
  customer,
  location,
} from 'customer/infrastructure/custumer-mock';
import { Customer } from 'customer/domain/customer';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { CropCustomerStatusEnum } from 'enumerates/crop-customer-status.enum';
import {
  fakeData,
  loadFixtures,
} from 'customer/infrastructure/customer-repository.fixture';

describe('CustomerRepositoryImpl', () => {
  let ctx: IntegrationTestContext;
  let repository: CustomerRepository;

  beforeEach(async () => {
    ctx = await setupIntegrationTest(loadFixtures);
    repository = ctx.app.get<CustomerRepository>(CustomerRepository);

  });

  afterEach(async () => {
    await ctx.cleanup();
  });

  describe('Create', () => {
    it('create to be a defined', async () => {
      expect(repository.create).toBeDefined();
    });

    it('should create a customer', async () => {
      const simpleCustomer = new Customer(customer);

      const saved = await repository.create(simpleCustomer);
      expect(saved.identifier).toEqual(simpleCustomer.identifier);
      expect(saved.groupIdentifier).toEqual(simpleCustomer.groupIdentifier);
      expect(saved.description).toEqual(simpleCustomer.description);
      expect(saved.financialTools).toEqual(simpleCustomer.financialTools);
      expect(saved.receivesLandRent).toEqual(simpleCustomer.receivesLandRent);
      expect(saved.grainConsumer.isConsumer).toEqual(simpleCustomer.grainConsumer.isConsumer);
      expect(saved.grainConsumer.isOwnGrain).toEqual(simpleCustomer.grainConsumer.isOwnGrain);
      expect(saved.grainConsumer.isReceiveThirdGrains).toEqual(simpleCustomer.grainConsumer.isReceiveThirdGrains);
      expect(saved.grainConsumer.annualQuantity).toEqual(simpleCustomer.grainConsumer.annualQuantity);
    });

    describe('locations', () => {
      it('should create a customer with locations', async () => {
        const customerWithLocation = new Customer({
          ...customer,
          locations: [{ ...location }],
        });

        const saved = await repository.create(customerWithLocation);
        const savedLocation = saved.locations[0];
        expect(savedLocation.name).toEqual(location.name);
        expect(savedLocation.description).toEqual(location.description);
        expect(savedLocation.address).toEqual(location.address);
        expect(savedLocation.totalHectares).toEqual(location.totalHectares);
        expect(savedLocation.coordinates.lat).toEqual(location.coordinates.lat);
        expect(savedLocation.coordinates.long).toEqual(location.coordinates.long);
      });
    });

    describe('persons', () => {
      it('should create a customer with persons', async () => {
        const customerWithPersons = new Customer({
          ...customer,
          persons: [{
            person: fakeData.person,
            occupation: fakeData.occupation,
          }],
        });

        const saved = await repository.create(customerWithPersons);
        const savedPerson = saved.persons[0];
        expect(savedPerson.id).not.toBeNull();
        expect(savedPerson.uuid).not.toBeNull();
        expect(savedPerson.person.id).toEqual(fakeData.person.id);
        expect(savedPerson.person.uuid).toEqual(fakeData.person.uuid);
        expect(savedPerson.occupation.id).toEqual(fakeData.occupation.id);
        expect(savedPerson.occupation.uuid).toEqual(fakeData.occupation.uuid);
      });
    });

    describe('activities', () => {
      it('should create a customer with activities', async () => {
        const customerWithActivities = new Customer({
          ...customer,
          activities: [{
            activity: {
              id: fakeData.activity.id,
              uuid: fakeData.activity.uuid,
              name: fakeData.activity.name,
            },
          }, {
            activity: {
              id: fakeData.activity2.id,
              uuid: fakeData.activity2.uuid,
              name: fakeData.activity2.name,
            },
          }],
        });

        const saved = await repository.create(customerWithActivities);
        const sortedSavedActivities = saved.activities.sort((a, b) => a.activity.uuid.localeCompare(b.activity.uuid));
        const sortedFakeActivities = customerWithActivities.activities
          .sort((a, b) => a.activity.uuid.localeCompare(b.activity.uuid));

        const savedActivity1 = sortedSavedActivities[0];
        expect(savedActivity1.id).not.toBeNull();
        expect(savedActivity1.uuid).not.toBeNull();
        expect(savedActivity1.activity.id).toEqual(sortedFakeActivities[0].activity.id);
        expect(savedActivity1.activity.uuid).toEqual(sortedFakeActivities[0].activity.uuid);

        const savedActivity2 = sortedSavedActivities[1];
        expect(savedActivity2.id).not.toBeNull();
        expect(savedActivity2.uuid).not.toBeNull();
        expect(savedActivity2.activity.id).toEqual(sortedFakeActivities[1].activity.id);
        expect(savedActivity2.activity.uuid).toEqual(sortedFakeActivities[1].activity.uuid);
      });
    });

    describe('cropInformation', () => {
      it('should create a customer with cropInformation', async () => {
        const customerWithCropInformation = new Customer({
          ...customer,
          cropInformation: [{
            typeCrop: CropTypeEnum.SUMMER,
            plantingSeasonStart: new Date('2025-09-01'),
            plantingSeasonEnd: new Date('2025-12-01'),
            harvestSeasonStart: new Date('2026-03-01'),
            harvestSeasonEnd: new Date('2026-06-01'),
            cultivations: [
              {
                cultivation: {
                  ...fakeData.cultivation,
                },
              },
            ],
          }],
        });

        const saved = await repository.create(customerWithCropInformation);
        const sortedSavedCropInformation = saved.cropInformation.sort((a, b) => a.uuid.localeCompare(b.uuid));
        const sortedFakeCropInformation = customerWithCropInformation.cropInformation.sort((a, b) => a.uuid.localeCompare(b.uuid));

        sortedSavedCropInformation.forEach((savedCropInformation, index) => {
          const expectedCropInformation = sortedFakeCropInformation[index];

          expect(savedCropInformation.id).not.toBeNull();
          expect(savedCropInformation.uuid).not.toBeNull();
          expect(savedCropInformation.typeCrop).toEqual(expectedCropInformation.typeCrop);
          expect(savedCropInformation.plantingSeasonStart).toEqual(expectedCropInformation.plantingSeasonStart);
          expect(savedCropInformation.plantingSeasonEnd).toEqual(expectedCropInformation.plantingSeasonEnd);
          expect(savedCropInformation.harvestSeasonStart).toEqual(expectedCropInformation.harvestSeasonStart);
          expect(savedCropInformation.harvestSeasonEnd).toEqual(expectedCropInformation.harvestSeasonEnd);

          const sortedSavedCultivations = savedCropInformation.cultivations.sort((a, b) => a.cultivation.uuid.localeCompare(b.cultivation.uuid));
          const sortedFakeCultivations = expectedCropInformation.cultivations.sort((a, b) => a.cultivation.uuid.localeCompare(b.cultivation.uuid));

          sortedSavedCultivations.forEach((savedCultivation, cultivationIndex) => {
            const expectedCultivation = sortedFakeCultivations[cultivationIndex];
            expect(savedCultivation.id).not.toBeNull();
            expect(savedCultivation.uuid).not.toBeNull();
            expect(savedCultivation.cultivation.id).toEqual(expectedCultivation.cultivation.id);
            expect(savedCultivation.cultivation.uuid).toEqual(expectedCultivation.cultivation.uuid);
          });
        });
      });
    });

    describe('crop', () => {
      it('should create a customer with crop', async () => {
        const customerWithCrop = new Customer({
          ...customer,
          crops: [{
            ...crop,
            cultivation: fakeData.cultivation,
            crop: fakeData.crop,
          }],
        });

        const saved = await repository.create(customerWithCrop);
        const savedCrop = saved.crops[0];
        expect(savedCrop.id).not.toBeNull();
        expect(savedCrop.uuid).not.toBeNull();
        expect(savedCrop.identification).toEqual(crop.identification);
        expect(savedCrop.cropStatus).toEqual(crop.cropStatus);
        expect(savedCrop.description).toEqual(crop.description);
        expect(savedCrop.plantingDate).toEqual(crop.plantingDate);
        expect(savedCrop.harvestDate).toEqual(crop.harvestDate);
        expect(savedCrop.plantedAreaHectares).toEqual(crop.plantedAreaHectares);
        expect(savedCrop.averageProductivity).toEqual(crop.averageProductivity);
        expect(savedCrop.conservativeProductivity).toEqual(crop.conservativeProductivity);
        expect(savedCrop.expectedTotalProduction).toEqual(crop.expectedTotalProduction);
        expect(savedCrop.nitrogenPercentage).toEqual(crop.nitrogenPercentage);
        expect(savedCrop.phosphorusPercentage).toEqual(crop.phosphorusPercentage);
        expect(savedCrop.potassiumPercentage).toEqual(crop.potassiumPercentage);
        expect(savedCrop.ammoniumSulfatePercentage).toEqual(crop.ammoniumSulfatePercentage);
        expect(savedCrop.defensivePercentage).toEqual(crop.defensivePercentage);
        expect(savedCrop.seedPercentage).toEqual(crop.seedPercentage);
        expect(savedCrop.totalSoldBags).toEqual(crop.totalSoldBags);
        expect(savedCrop.totalSoldPercentage).toEqual(crop.totalSoldPercentage);
        expect(savedCrop.averageSalesValue).toEqual(crop.averageSalesValue);

        expect(savedCrop.cultivation.id).toEqual(fakeData.cultivation.id);
        expect(savedCrop.cultivation.uuid).toEqual(fakeData.cultivation.uuid);
        expect(savedCrop.crop.id).toEqual(fakeData.crop.id);
        expect(savedCrop.crop.uuid).toEqual(fakeData.crop.uuid);

      });
    });
  });

  describe('Update', () => {
    it('should change identifier', async () => {
      const customer = new Customer({
        ...fakeData.customer,
        identifier: 'New identifier',
        groupIdentifier: 'New GroupOO1',
        grainConsumer: {
          isConsumer: fakeData.customer.grainConsumer,
          isOwnGrain: fakeData.customer.ownGrain,
          isReceiveThirdGrains: fakeData.customer.receiveThirdGrains,
          annualQuantity: fakeData.customer.annualQuantity,
        },
        locations: [{
          ...fakeData.customerLocation, coordinates: {
            lat: fakeData.customerLocation.latitude,
            long: fakeData.customerLocation.longitude,
          },
        }],
      });

      const saved = await repository.update(customer);

      expect(saved.identifier).toEqual(customer.identifier);
      expect(saved.groupIdentifier).toEqual(customer.groupIdentifier);

    });

    it('should add new location', async () => {
      const customer = new Customer({
        ...fakeData.customer,
        grainConsumer: {
          isConsumer: fakeData.customer.grainConsumer,
          isOwnGrain: fakeData.customer.ownGrain,
          isReceiveThirdGrains: fakeData.customer.receiveThirdGrains,
          annualQuantity: fakeData.customer.annualQuantity,
        },
        locations: [
          {
            ...fakeData.customerLocation,
            description: null,
            coordinates: {
              lat: fakeData.customerLocation.latitude,
              long: fakeData.customerLocation.longitude,
            },
          },
          { ...location },
        ],
      });

      const saved = await repository.update(customer);

      const sortedSavedLocations = saved.locations.sort((a, b) => a.name.localeCompare(b.name));
      const sortedFakeLocations = customer.locations.sort((a, b) => a.name.localeCompare(b.name));

      sortedSavedLocations.forEach((savedLocation, index) => {
        const expectedLocation = sortedFakeLocations[index];

        expect(savedLocation.name).toEqual(expectedLocation.name);
        expect(savedLocation.description).toEqual(expectedLocation.description);
        expect(savedLocation.address).toEqual(expectedLocation.address);
        expect(savedLocation.totalHectares).toEqual(expectedLocation.totalHectares);
        expect(savedLocation.coordinates.lat).toEqual(expectedLocation.coordinates.lat);
        expect(savedLocation.coordinates.long).toEqual(expectedLocation.coordinates.long);
      });

    });

    it('should remove locations, persons, activities, crops, cropInformation', async () => {
      const customerDB = await repository.findOneById(fakeData.customer.id);
      expect(customerDB.locations.length).toEqual(1);
      expect(customerDB.persons.length).toEqual(1);
      expect(customerDB.activities.length).toEqual(1);
      expect(customerDB.crops.length).toEqual(1);
      expect(customerDB.crops.length).toEqual(1);
      expect(customerDB.cropInformation.length).toEqual(1);

      const customer = new Customer({
        ...fakeData.customer,
        grainConsumer: {
          isConsumer: fakeData.customer.grainConsumer,
          isOwnGrain: fakeData.customer.ownGrain,
          isReceiveThirdGrains: fakeData.customer.receiveThirdGrains,
          annualQuantity: fakeData.customer.annualQuantity,
        },
        locations: [],
        persons: [],
        activities: [],
        cropInformation: [],
        crops: [],
      });

      const saved = await repository.update(customer);

      expect(saved.locations).toEqual([]);
      expect(saved.persons).toEqual([]);
      expect(saved.activities).toEqual([]);
      expect(saved.crops).toEqual([]);
      expect(saved.cropInformation).toEqual([]);
    });

    it('should add location in crop', async () => {
      const customer = new Customer({
        ...fakeData.customer,
        grainConsumer: {
          isConsumer: fakeData.customer.grainConsumer,
          isOwnGrain: fakeData.customer.ownGrain,
          isReceiveThirdGrains: fakeData.customer.receiveThirdGrains,
          annualQuantity: fakeData.customer.annualQuantity,
        },
        locations: [{
          ...fakeData.customerLocation, coordinates: {
            lat: fakeData.customerLocation.latitude,
            long: fakeData.customerLocation.longitude,
          },
        }],
        crops: [{
          ...fakeData.customerCrop,
          locations: [{
            id: fakeData.customerLocation.id,
          }],
        }],
      });

      const saved = await repository.update(customer);
      const savedCrop = saved.crops[0];
      expect(savedCrop.id).not.toBeNull();
      expect(savedCrop.uuid).not.toBeNull();

      expect(savedCrop.cultivation.uuid).toEqual(fakeData.cultivation.uuid);
      expect(savedCrop.crop.uuid).toEqual(fakeData.crop.uuid);

      const savedCropLocation = savedCrop.locations[0];

      expect(savedCropLocation.id).toEqual(fakeData.customerLocation.id);
      expect(savedCropLocation.uuid).toEqual(fakeData.customerLocation.uuid);
    });

  });
  describe('Delete', () => {
    it('should remove in soft-delete customer and aggregates', async () => {
      await repository.delete(fakeData.customer.uuid);

      const customerDeletedAt =
        await ctx.dataSource.query(
          ` SELECT deleted_at
            FROM customers
            WHERE id = ${fakeData.customer.id}
          `);
      expect(customerDeletedAt).not.toBeNull;
      expect(customerDeletedAt[0].deleted_at).toBeInstanceOf(Date);

      const customerCropDeletedAt =
        await ctx.dataSource.query(
          ` SELECT deleted_at
            FROM customer_crops
            WHERE id = ${fakeData.customerCrop.id}
          `);
      expect(customerCropDeletedAt).not.toBeNull;
      expect(customerCropDeletedAt[0].deleted_at).toBeInstanceOf(Date);

      const customerLocationDeletedAt =
        await ctx.dataSource.query(
          ` SELECT deleted_at
            FROM customer_locations
            WHERE id = ${fakeData.customerLocation.id}
          `);
      expect(customerLocationDeletedAt).not.toBeNull;
      expect(customerLocationDeletedAt[0].deleted_at).toBeInstanceOf(Date);


      const customerActivityDeletedAt =
        await ctx.dataSource.query(
          ` SELECT deleted_at
            FROM customer_activities
            WHERE id = ${fakeData.customerActivity.id}
          `);
      expect(customerActivityDeletedAt).not.toBeNull;
      expect(customerActivityDeletedAt[0].deleted_at).toBeInstanceOf(Date);

      const customerCropInformationDeletedAt =
        await ctx.dataSource.query(
          ` SELECT deleted_at
            FROM customer_crop_information
            WHERE id = ${fakeData.customerCropInformation.id}
          `);
      expect(customerCropInformationDeletedAt).not.toBeNull;
      expect(customerCropInformationDeletedAt[0].deleted_at).toBeInstanceOf(Date);

      const customerPersonDeletedAt =
        await ctx.dataSource.query(
          ` SELECT deleted_at
            FROM customer_persons
            WHERE id = ${fakeData.customerPerson.id}
          `);
      expect(customerPersonDeletedAt).not.toBeNull;
      expect(customerPersonDeletedAt[0].deleted_at).toBeInstanceOf(Date);
    });
  });

  describe('findOneById', () => {
    it('should return customer domain', async () => {
      const customer = await repository.findOneById(fakeData.customer.id);
      verifierDomainObject(customer);
    });
  });

  describe('findOneByUuid', () => {
    it('should return customer domain', async () => {
      const customer = await repository.findOneByUuid(fakeData.customer.uuid);
      verifierDomainObject(customer);
    });
  });


  const verifierDomainObject = (customer) => {
    expect(customer).toBeInstanceOf(Customer);

    expect(customer.identifier).toEqual(fakeData.customer.identifier);
    expect(customer.groupIdentifier).toEqual(fakeData.customer.groupIdentifier);
    expect(customer.description).toEqual(fakeData.customer.description);
    expect(customer.financialTools).toBeFalsy();
    expect(customer.receivesLandRent).toBeFalsy();
    expect(customer.grainConsumer.isConsumer).toBeFalsy();
    expect(customer.grainConsumer.isOwnGrain).toBeFalsy();
    expect(customer.grainConsumer.isReceiveThirdGrains).toBeFalsy();
    expect(customer.grainConsumer.annualQuantity).toEqual(0);

    const person = customer.persons[0];
    expect(person.id).toEqual(fakeData.customerPerson.id);
    expect(person.uuid).toEqual(fakeData.customerPerson.uuid);
    expect(person.person.id).toEqual(fakeData.person.id);
    expect(person.person.uuid).toEqual(fakeData.person.uuid);
    expect(person.occupation.id).toEqual(fakeData.occupation.id);
    expect(person.occupation.uuid).toEqual(fakeData.occupation.uuid);

    const location = customer.locations[0];
    expect(location.name).toEqual(fakeData.customerLocation.name);
    expect(location.description).toBeNull();
    expect(location.address).toEqual(fakeData.customerLocation.address);
    expect(location.totalHectares).toEqual(0);
    expect(location.coordinates.lat).toEqual(fakeData.customerLocation.latitude);
    expect(location.coordinates.long).toEqual(fakeData.customerLocation.longitude);

    const activity = customer.activities[0];
    expect(activity.id).toEqual(fakeData.customerActivity.id);
    expect(activity.uuid).toEqual(fakeData.customerActivity.uuid);
    expect(activity.activity.id).toEqual(fakeData.activity2.id);
    expect(activity.activity.uuid).toEqual(fakeData.activity2.uuid);

    const cropInformation = customer.cropInformation[0];
    expect(cropInformation.id).toEqual(fakeData.customerCropInformation.id);
    expect(cropInformation.uuid).toEqual(fakeData.customerCropInformation.uuid);
    expect(cropInformation.typeCrop).toEqual(fakeData.customerCropInformation.typeCrop);
    expect(cropInformation.plantingSeasonStart).toEqual(fakeData.customerCropInformation.plantingSeasonStart);
    expect(cropInformation.plantingSeasonEnd).toEqual(fakeData.customerCropInformation.plantingSeasonEnd);
    expect(cropInformation.harvestSeasonStart).toEqual(fakeData.customerCropInformation.harvestSeasonStart);
    expect(cropInformation.harvestSeasonEnd).toEqual(fakeData.customerCropInformation.harvestSeasonEnd);
    const cropInformationCultivation = cropInformation.cultivations[0];
    expect(cropInformationCultivation.id).toEqual(fakeData.customerCropInformationCultivation.id);
    expect(cropInformationCultivation.uuid).toEqual(fakeData.customerCropInformationCultivation.uuid);
    expect(cropInformationCultivation.cultivation.id).toEqual(fakeData.cultivation.id);
    expect(cropInformationCultivation.cultivation.uuid).toEqual(fakeData.cultivation.uuid);

    const crop = customer.crops[0];
    expect(crop.id).toEqual(fakeData.customerCrop.id);
    expect(crop.uuid).toEqual(fakeData.customerCrop.uuid);
    expect(crop.identification).toEqual(fakeData.customerCrop.identification);
    expect(crop.cropStatus).toEqual(CropCustomerStatusEnum.PLANTED);
    expect(crop.description).toBeNull();
    expect(crop.plantingDate).toEqual(fakeData.customerCrop.plantingDate);
    expect(crop.harvestDate).toEqual(fakeData.customerCrop.harvestDate);
    expect(crop.plantedAreaHectares).toEqual(fakeData.customerCrop.plantedAreaHectares);
    expect(crop.averageProductivity).toEqual(fakeData.customerCrop.averageProductivity);
    expect(crop.conservativeProductivity).toEqual(fakeData.customerCrop.conservativeProductivity);
    expect(crop.expectedTotalProduction).toEqual(fakeData.customerCrop.expectedTotalProduction);
    expect(crop.nitrogenPercentage).toEqual(fakeData.customerCrop.nitrogenPercentage);
    expect(crop.phosphorusPercentage).toEqual(fakeData.customerCrop.phosphorusPercentage);
    expect(crop.potassiumPercentage).toEqual(fakeData.customerCrop.potassiumPercentage);
    expect(crop.ammoniumSulfatePercentage).toEqual(fakeData.customerCrop.ammoniumSulfatePercentage);
    expect(crop.defensivePercentage).toEqual(fakeData.customerCrop.defensivePercentage);
    expect(crop.seedPercentage).toEqual(fakeData.customerCrop.seedPercentage);
    expect(crop.totalSoldBags).toEqual(fakeData.customerCrop.totalSoldBags);
    expect(crop.totalSoldPercentage).toEqual(fakeData.customerCrop.totalSoldPercentage);
    expect(crop.averageSalesValue).toEqual(fakeData.customerCrop.averageSalesValue);

    expect(crop.cultivation.id).toEqual(fakeData.cultivation.id);
    expect(crop.cultivation.uuid).toEqual(fakeData.cultivation.uuid);
    expect(crop.crop.id).toEqual(fakeData.crop.id);
    expect(crop.crop.uuid).toEqual(fakeData.crop.uuid);
  };

});
