import {
  IntegrationTestContext,
  setupIntegrationTest,
} from 'shared/test-helpers/test-integration-setup.helper';
import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { getAuthToken } from 'shared/test-helpers/get-token-auth.helper';
import { fakeData, loadFixtures } from 'customer/interface/customer.fixture';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { CropCustomerStatusEnum } from 'enumerates/crop-customer-status.enum';

describe('Customers', () => {
  let ctx: IntegrationTestContext;
  let token;

  beforeEach(async () => {
    ctx = await setupIntegrationTest(loadFixtures);
    token = await getAuthToken(ctx.app, 'patria@patria.com', '12345');
  });

  afterEach(async () => {
    await ctx.cleanup();
  });

  describe('POST /v1/customers', () => {
    it(`Should create a successful Customers`, async () => {
      const requestBody = {
        identifier: 'G01',
        groupIdentifier: 'G001',
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
            name: 'Fazenda Boa Vista',
            description: 'Localização de Teste',
            address: 'Estrada 1000',
            coordinates: { lat: -23.55052, long: -46.633308 },
            totalHectares: 500,
          },
        ],
        activities: [{
          activity: {
            uuid: fakeData.activity.uuid,
            name: fakeData.activity.name,
          },
        }],
        persons: [
          {
            person: {
              uuid: fakeData.person.uuid,
              name: fakeData.person.name,
            },
            occupation: {
              uuid: fakeData.occupation.uuid,
              name: fakeData.occupation.name,
            },
          },
        ],
        cropInformation: [
          {
            typeCrop: CropTypeEnum.SUMMER,
            plantingSeasonStart: new Date('2025-09-01'),
            plantingSeasonEnd: new Date('2025-12-01'),
            harvestSeasonStart: new Date('2026-03-01'),
            harvestSeasonEnd: new Date('2026-06-01'),
            cultivations: [
              {
                cultivation: {
                  uuid: fakeData.cultivation.uuid,
                  name: fakeData.cultivation.name,
                },
              },
            ],
          },
        ],
        crops: [
          {
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
            cultivation: {
              uuid: fakeData.cultivation.uuid,
              name: fakeData.cultivation.name,
            },
            crop: {
              uuid: fakeData.crop.uuid,
              name: fakeData.crop.name,
            },
          },
        ],
      };


      const { body } = await request(ctx.app.getHttpServer())
        .post(`/v1/customers`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(HttpStatus.CREATED);


      const result = body.result;

      expect(result).toHaveProperty('uuid');
      expect(result.uuid).not.toBeNull();
      expect(result.uuid).not.toEqual('');
      expect(result.identifier).toEqual(requestBody.identifier);
      expect(result.groupIdentifier).toEqual(requestBody.groupIdentifier);
      expect(result.description).toEqual(requestBody.description);
      expect(result.financialTools).toEqual(requestBody.financialTools);
      expect(result.receivesLandRent).toEqual(requestBody.receivesLandRent);
      expect(result.grainConsumer.isConsumer).toEqual(requestBody.grainConsumer.isConsumer);
      expect(result.grainConsumer.isOwnGrain).toEqual(requestBody.grainConsumer.isOwnGrain);
      expect(result.grainConsumer.isReceiveThirdGrains).toEqual(requestBody.grainConsumer.isReceiveThirdGrains);
      expect(result.grainConsumer.annualQuantity).toEqual(requestBody.grainConsumer.annualQuantity);

      result.locations.map((savedLocation, index) => {
        expect(savedLocation).toHaveProperty('uuid');
        expect(savedLocation.uuid).not.toBeNull();
        expect(savedLocation.uuid).not.toEqual('');
        expect(savedLocation.name).toEqual(requestBody.locations[index].name);
        expect(savedLocation.description).toEqual(requestBody.locations[index].description);
        expect(savedLocation.address).toEqual(requestBody.locations[index].address);
        expect(savedLocation.totalHectares).toEqual(requestBody.locations[index].totalHectares);
        expect(savedLocation.coordinates.lat).toEqual(requestBody.locations[index].coordinates.lat);
        expect(savedLocation.coordinates.long).toEqual(requestBody.locations[index].coordinates.long);
      });

      result.activities.map((customerActivity, index) => {
        expect(customerActivity).toHaveProperty('uuid');
        expect(customerActivity.uuid).not.toBeNull();
        expect(customerActivity.uuid).not.toEqual('');
        expect(customerActivity.activity.uuid).toEqual(requestBody.activities[index].activity.uuid);
      });

      result.persons.map((savedPerson, index) => {
        expect(savedPerson).toHaveProperty('uuid');
        expect(savedPerson.uuid).not.toBeNull();
        expect(savedPerson.uuid).not.toEqual('');
        expect(savedPerson.person.uuid).toEqual(requestBody.persons[index].person.uuid);
        expect(savedPerson.occupation.uuid).toEqual(requestBody.persons[index].occupation.uuid);
      });

      result.cropInformation.map((CustumerCropInformation, index) => {
        expect(CustumerCropInformation).toHaveProperty('uuid');
        expect(CustumerCropInformation.uuid).not.toBeNull();
        expect(CustumerCropInformation.uuid).not.toEqual('');
        expect(CustumerCropInformation.typeCrop).toEqual(requestBody.cropInformation[index].typeCrop);
        expect(CustumerCropInformation.plantingSeasonStart).toEqual(requestBody.cropInformation[index].plantingSeasonStart.toISOString());
        expect(CustumerCropInformation.plantingSeasonEnd).toEqual(requestBody.cropInformation[index].plantingSeasonEnd.toISOString());
        expect(CustumerCropInformation.harvestSeasonStart).toEqual(requestBody.cropInformation[index].harvestSeasonStart.toISOString());
        expect(CustumerCropInformation.harvestSeasonEnd).toEqual(requestBody.cropInformation[index].harvestSeasonEnd.toISOString());


        CustumerCropInformation.cultivations.map((cropInfoCultivation, cultivationIndex) => {
          const cultivationUuid = requestBody.cropInformation[index].cultivations[cultivationIndex].cultivation.uuid;
          expect(cropInfoCultivation.cultivation.uuid).toEqual(cultivationUuid);
        });
      });

      result.crops.map((savedCrop, index) => {
        expect(savedCrop).toHaveProperty('uuid');
        expect(savedCrop.uuid).not.toBeNull();
        expect(savedCrop.uuid).not.toEqual('');
        expect(savedCrop.identification).toEqual(requestBody.crops[index].identification);
        expect(savedCrop.cropStatus).toEqual(requestBody.crops[index].cropStatus);
        expect(savedCrop.description).toEqual(requestBody.crops[index].description);
        expect(savedCrop.plantingDate).toEqual(requestBody.crops[index].plantingDate.toISOString());
        expect(savedCrop.harvestDate).toEqual(requestBody.crops[index].harvestDate.toISOString());
        expect(savedCrop.plantedAreaHectares).toEqual(requestBody.crops[index].plantedAreaHectares);
        expect(savedCrop.averageProductivity).toEqual(requestBody.crops[index].averageProductivity);
        expect(savedCrop.conservativeProductivity).toEqual(requestBody.crops[index].conservativeProductivity);
        expect(savedCrop.expectedTotalProduction).toEqual(requestBody.crops[index].expectedTotalProduction);
        expect(savedCrop.nitrogenPercentage).toEqual(requestBody.crops[index].nitrogenPercentage);
        expect(savedCrop.phosphorusPercentage).toEqual(requestBody.crops[index].phosphorusPercentage);
        expect(savedCrop.potassiumPercentage).toEqual(requestBody.crops[index].potassiumPercentage);
        expect(savedCrop.ammoniumSulfatePercentage).toEqual(requestBody.crops[index].ammoniumSulfatePercentage);
        expect(savedCrop.defensivePercentage).toEqual(requestBody.crops[index].defensivePercentage);
        expect(savedCrop.seedPercentage).toEqual(requestBody.crops[index].seedPercentage);
        expect(savedCrop.totalSoldBags).toEqual(requestBody.crops[index].totalSoldBags);
        expect(savedCrop.totalSoldPercentage).toEqual(requestBody.crops[index].totalSoldPercentage);
        expect(savedCrop.averageSalesValue).toEqual(requestBody.crops[index].averageSalesValue);
        expect(savedCrop.cultivation.uuid).toEqual(requestBody.crops[index].cultivation.uuid);
        expect(savedCrop.crop.uuid).toEqual(requestBody.crops[index].crop.uuid);
      });

    });

    it(`should throw exception when request body is empty`, async () => {
      const { body } = await request(ctx.app.getHttpServer())
        .post(`/v1/customers`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(HttpStatus.BAD_REQUEST);

      expect(body.message).toEqual('identifier must be a string, identifier should not be empty, grainConsumer should not be empty');
    });
  });

  describe('PUT /v1/customers', () => {
    it(`Should update a successful Customers`, async () => {
      const requestBody = {
          uuid: fakeData.customer.uuid,
          identifier: fakeData.customer.identifier,
          groupIdentifier: fakeData.customer.groupIdentifier,
          description: 'Descrição marota',
          financialTools: false,
          receivesLandRent: false,
          grainConsumer: {
            isConsumer: false,
            isOwnGrain: false,
            isReceiveThirdGrains: false,
            annualQuantity: 0,
          },
          locations:
            [
              {
                uuid: fakeData.customerLocation.uuid,
                name: fakeData.customerLocation.name,
                description: fakeData.customerLocation.name,
                address: fakeData.customerLocation.name,
                coordinates: {
                  lat: fakeData.customerLocation.latitude,
                  long: fakeData.customerLocation.longitude,
                },
                totalHectares: fakeData.customerLocation.totalHectares,
              },
              {
                name: 'Fazenda Boa Vista',
                description: 'Localização de Teste',
                address: 'Estrada 1000',
                coordinates: { lat: -23.55052, long: -46.633308 },
                totalHectares: 500,
              },
            ],
          activities: [{
            uuid: fakeData.customerActivity.uuid,
            activity: {
              uuid: fakeData.activity.uuid,
              name: fakeData.activity.name,
            },
          }],
          persons: [
            {
              uuid: fakeData.customerPerson.uuid,
              person: {
                uuid: fakeData.person.uuid,
                name: fakeData.person.name,
              },
              occupation: {
                uuid: fakeData.occupation.uuid,
                name: fakeData.occupation.name,
              },
            },
          ],
          cropInformation: [
            {
              uuid: fakeData.customerCropInformation.uuid,
              typeCrop: fakeData.customerCropInformation.typeCrop,
              plantingSeasonStart: fakeData.customerCropInformation.plantingSeasonStart,
              plantingSeasonEnd: fakeData.customerCropInformation.plantingSeasonEnd,
              harvestSeasonStart: fakeData.customerCropInformation.harvestSeasonStart,
              harvestSeasonEnd: fakeData.customerCropInformation.harvestSeasonEnd,
              cultivations: [
                {
                  uuid: fakeData.customerCropInformationCultivation.uuid,
                  cultivation: {
                    uuid: fakeData.cultivation.uuid,
                    name: fakeData.cultivation.name,
                  },
                },
              ],
            },
          ],
          crops: [
            {
              identification: 'Safra 2025 Teste',
              cropStatus: CropCustomerStatusEnum.PLANTED,
              description: 'Safra de soja 2025 Teste',
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
                uuid: fakeData.cultivation.uuid,
                name: fakeData.cultivation.name,
              },
              crop: {
                uuid: fakeData.crop.uuid,
                name: fakeData.crop.name,
              },
            },
          ],
        }
      ;


      const { body } = await request(ctx.app.getHttpServer())
        .put(`/v1/customers`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(HttpStatus.OK);


      const result = body.result;

      expect(result).toHaveProperty('uuid');
      expect(result.uuid).toEqual(fakeData.customer.uuid);
      expect(result.identifier).toEqual(requestBody.identifier);
      expect(result.groupIdentifier).toEqual(requestBody.groupIdentifier);
      expect(result.description).toEqual(requestBody.description);
      expect(result.financialTools).toEqual(requestBody.financialTools);
      expect(result.receivesLandRent).toEqual(requestBody.receivesLandRent);
      expect(result.grainConsumer.isConsumer).toEqual(requestBody.grainConsumer.isConsumer);
      expect(result.grainConsumer.isOwnGrain).toEqual(requestBody.grainConsumer.isOwnGrain);
      expect(result.grainConsumer.isReceiveThirdGrains).toEqual(requestBody.grainConsumer.isReceiveThirdGrains);
      expect(result.grainConsumer.annualQuantity).toEqual(requestBody.grainConsumer.annualQuantity);

      const sortedSavedLocations = result.locations.sort((a, b) => a.name.localeCompare(b.name));
      const sortedRequestLocations = requestBody.locations.sort((a, b) => a.name.localeCompare(b.name));

      sortedSavedLocations.forEach((savedLocation, index) => {
        expect(savedLocation).toHaveProperty('uuid');
        expect(savedLocation.uuid).not.toBeNull();
        expect(savedLocation.uuid).not.toEqual('');
        expect(savedLocation.name).toEqual(sortedRequestLocations[index].name);
        expect(savedLocation.description).toEqual(sortedRequestLocations[index].description);
        expect(savedLocation.address).toEqual(sortedRequestLocations[index].address);
        expect(savedLocation.totalHectares).toEqual(sortedRequestLocations[index].totalHectares);
        expect(savedLocation.coordinates.lat).toEqual(sortedRequestLocations[index].coordinates.lat);
        expect(savedLocation.coordinates.long).toEqual(sortedRequestLocations[index].coordinates.long);
      });

      const sortedSavedActivities = result.activities.sort((a, b) => a.uuid.localeCompare(b.uuid));
      const sortedRequestActivities = requestBody.activities.sort((a, b) => a.uuid.localeCompare(b.uuid));
      sortedSavedActivities.forEach((customerActivity, index) => {
        expect(customerActivity.uuid).toEqual(sortedRequestActivities[index].uuid);
        expect(customerActivity.activity.uuid).toEqual(sortedRequestActivities[index].activity.uuid);
      });

      const sortedSavedPersons = result.persons.sort((a, b) => a.uuid.localeCompare(b.uuid));
      const sortedRequestPersons = requestBody.persons.sort((a, b) => a.uuid.localeCompare(b.uuid));
      sortedSavedPersons.forEach((custumerPerson, index) => {
        expect(custumerPerson.uuid).toEqual(sortedRequestPersons[index].uuid);
        expect(custumerPerson.person.uuid).toEqual(sortedRequestPersons[index].person.uuid);
        expect(custumerPerson.occupation.uuid).toEqual(sortedRequestPersons[index].occupation.uuid);
      });

      const sortedSavedCropInformation = result.cropInformation.sort((a, b) => a.uuid.localeCompare(b.uuid));
      const sortedRequestCropInformation = requestBody.cropInformation.sort((a, b) => a.uuid.localeCompare(b.uuid));
      sortedSavedCropInformation.forEach((customerCropInformation, index) => {
        expect(customerCropInformation).toHaveProperty('uuid');
        expect(customerCropInformation.uuid).not.toBeNull();
        expect(customerCropInformation.uuid).not.toEqual('');
        expect(customerCropInformation.typeCrop).toEqual(sortedRequestCropInformation[index].typeCrop);
        expect(customerCropInformation.plantingSeasonStart).toEqual(sortedRequestCropInformation[index].plantingSeasonStart.toISOString());
        expect(customerCropInformation.plantingSeasonEnd).toEqual(sortedRequestCropInformation[index].plantingSeasonEnd.toISOString());
        expect(customerCropInformation.harvestSeasonStart).toEqual(sortedRequestCropInformation[index].harvestSeasonStart.toISOString());
        expect(customerCropInformation.harvestSeasonEnd).toEqual(sortedRequestCropInformation[index].harvestSeasonEnd.toISOString());

        const sortedSavedCultivations = customerCropInformation.cultivations.sort((a, b) => a.uuid.localeCompare(b.uuid));
        const sortedRequestCultivations = sortedRequestCropInformation[index].cultivations.sort((a, b) => a.uuid.localeCompare(b.uuid));
        sortedSavedCultivations.forEach((customerCropInformationCultivation, cultivationIndex) => {
          const expectedCultivation = sortedRequestCultivations[cultivationIndex];
          expect(customerCropInformationCultivation.uuid).toEqual(expectedCultivation.uuid);
          expect(customerCropInformationCultivation.cultivation.uuid).toEqual(expectedCultivation.cultivation.uuid);
        });
      });

      const sortedSavedCrops = result.crops.sort((a, b) => a.identification.localeCompare(b.identification));
      const sortedRequestCrops = requestBody.crops.sort((a, b) => a.identification.localeCompare(b.identification));
      sortedSavedCrops.forEach((savedCrop, index) => {
        expect(savedCrop).toHaveProperty('uuid');
        expect(savedCrop.uuid).not.toBeNull();
        expect(savedCrop.uuid).not.toEqual('');
        expect(savedCrop.identification).toEqual(sortedRequestCrops[index].identification);
        expect(savedCrop.cropStatus).toEqual(sortedRequestCrops[index].cropStatus);
        expect(savedCrop.description).toEqual(sortedRequestCrops[index].description);
        expect(savedCrop.plantingDate).toEqual(sortedRequestCrops[index].plantingDate.toISOString());
        expect(savedCrop.harvestDate).toEqual(sortedRequestCrops[index].harvestDate.toISOString());
        expect(savedCrop.plantedAreaHectares).toEqual(sortedRequestCrops[index].plantedAreaHectares);
        expect(savedCrop.averageProductivity).toEqual(sortedRequestCrops[index].averageProductivity);
        expect(savedCrop.conservativeProductivity).toEqual(sortedRequestCrops[index].conservativeProductivity);
        expect(savedCrop.expectedTotalProduction).toEqual(sortedRequestCrops[index].expectedTotalProduction);
        expect(savedCrop.nitrogenPercentage).toEqual(sortedRequestCrops[index].nitrogenPercentage);
        expect(savedCrop.phosphorusPercentage).toEqual(sortedRequestCrops[index].phosphorusPercentage);
        expect(savedCrop.potassiumPercentage).toEqual(sortedRequestCrops[index].potassiumPercentage);
        expect(savedCrop.ammoniumSulfatePercentage).toEqual(sortedRequestCrops[index].ammoniumSulfatePercentage);
        expect(savedCrop.defensivePercentage).toEqual(sortedRequestCrops[index].defensivePercentage);
        expect(savedCrop.seedPercentage).toEqual(sortedRequestCrops[index].seedPercentage);
        expect(savedCrop.totalSoldBags).toEqual(sortedRequestCrops[index].totalSoldBags);
        expect(savedCrop.totalSoldPercentage).toEqual(sortedRequestCrops[index].totalSoldPercentage);
        expect(savedCrop.averageSalesValue).toEqual(sortedRequestCrops[index].averageSalesValue);
        expect(savedCrop.cultivation.uuid).toEqual(sortedRequestCrops[index].cultivation.uuid);
        expect(savedCrop.crop.uuid).toEqual(sortedRequestCrops[index].crop.uuid);
      });
    });
  });

  describe('DELETE /v1/customers', () => {
    it(`Should delete a successful Customers`, async () => {
      const { body: savedCustomer } = await request(ctx.app.getHttpServer())
        .get(`/v1/customers/${fakeData.customer.uuid}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      const result = savedCustomer.result;
      expect(result.uuid).toEqual(fakeData.customer.uuid);

      await request(ctx.app.getHttpServer())
        .delete(`/v1/customers/${fakeData.customer.uuid}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      const { body } = await request(ctx.app.getHttpServer())
        .get(`/v1/customers/${fakeData.customer.uuid}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(body.message).toEqual('Customer is not found');
    });
  });

  describe('GET /v1/customers', () => {
    it(`Should findOne Customers by uuid`, async () => {
      const { body } = await request(ctx.app.getHttpServer())
        .get(`/v1/customers/${fakeData.customer.uuid}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      const result = body.result;

      expect(result.uuid).toEqual(fakeData.customer.uuid);
      expect(result.identifier).toEqual(fakeData.customer.identifier);
      expect(result.groupIdentifier).toEqual(fakeData.customer.groupIdentifier);
      expect(result.description).toEqual(fakeData.customer.description);
      expect(result.financialTools).toEqual(fakeData.customer.financialTools);
      expect(result.receivesLandRent).toEqual(fakeData.customer.receivesLandRent);
      expect(result.grainConsumer.isConsumer).toEqual(fakeData.customer.grainConsumer);
      expect(result.grainConsumer.isOwnGrain).toEqual(fakeData.customer.ownGrain);
      expect(result.grainConsumer.isReceiveThirdGrains).toEqual(fakeData.customer.receiveThirdGrains);
      expect(result.grainConsumer.annualQuantity).toEqual(fakeData.customer.annualQuantity);
      expect(result.locations.length).toBe(1);
      expect(result.activities.length).toBe(1);
      expect(result.persons.length).toBe(1);
      expect(result.cropInformation.length).toBe(1);
    });
  });

  describe('GET /v1/customers', () => {
    it(`Should findAll Customers by uuid`, async () => {
      const { body } = await request(ctx.app.getHttpServer())
        .get(`/v1/customers`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      const result = body.result;

      expect(result.data.length).toBe(1);
      expect(result.total).toEqual(1);

      const customer = result.data[0];

      expect(customer.uuid).toEqual(fakeData.customer.uuid);
      expect(customer.identifier).toEqual(fakeData.customer.identifier);
      expect(customer.groupIdentifier).toEqual(fakeData.customer.groupIdentifier);
      expect(customer.description).toEqual(fakeData.customer.description);
      expect(customer.financialTools).toEqual(fakeData.customer.financialTools);
      expect(customer.receivesLandRent).toEqual(fakeData.customer.receivesLandRent);
      expect(customer.grainConsumer.isConsumer).toEqual(fakeData.customer.grainConsumer);
      expect(customer.grainConsumer.isOwnGrain).toEqual(fakeData.customer.ownGrain);
      expect(customer.grainConsumer.isReceiveThirdGrains).toEqual(fakeData.customer.receiveThirdGrains);
      expect(customer.grainConsumer.annualQuantity).toEqual(fakeData.customer.annualQuantity);
      expect(customer.locations.length).toBe(1);
      expect(customer.activities.length).toBe(1);
      expect(customer.persons.length).toBe(1);
      expect(customer.cropInformation.length).toBe(1);
    });
  });

});
