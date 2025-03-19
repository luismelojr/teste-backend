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
import { Injectable } from '@nestjs/common';
import {
  CustomerRepository,
} from 'customer/infrastructure/customer.repository';
import { CustomerActivity } from 'customer/domain/aggregates/customer-activity';
import { CustomerPerson } from 'customer/domain/aggregates/customer-person';
import {
  CustomerCropInformation,
} from 'customer/domain/aggregates/customer-crop-information';
import { CustomerCrop } from 'customer/domain/aggregates/customer-crop';
import {
  CustomerCropInformationCultivation,
} from 'customer/domain/aggregates/customer-crop-information-cultivation';

@Injectable()
export class CustomerRelationFetch {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly cropRepository: CropRepository,
    private readonly personRepository: PersonRepository,
    private readonly occupationRepository: OccupationRepository,
    private readonly cultivationRepository: CultivationRepository,
  ) {
  }

  async fetchRelations(command): Promise<any> {
    const activities = await Promise.all(
      command.activities?.map(async (customerActivity) => {
        let foundCustomerActivity: CustomerActivity;

        if (customerActivity.uuid) {
          foundCustomerActivity = await this.customerRepository.findCustomerActivityByUuid(customerActivity.uuid);

          if (!foundCustomerActivity) {
            throw new Error('Customer activity not found');
          }
        }

        const foundActivity = await this.activityRepository.findOneByUuid(customerActivity.activity.uuid);

        if (!foundActivity) {
          throw new Error('Activity not found');
        }
        return {
          id: foundCustomerActivity?.id || undefined,
          uuid: foundCustomerActivity?.uuid || undefined,
          activity: {
            id: foundActivity.id,
            uuid: foundActivity.uuid,
            name: foundActivity.name,
          },
        };
      }),
    );

    const persons = await Promise.all(
      command.persons?.map(async (customerPerson) => {
        const { uuid, person, occupation } = customerPerson;

        let foundCustomerPerson: CustomerPerson;

        if (uuid) {
          foundCustomerPerson = await this.customerRepository.findCustomerPersonByUuid(uuid);

          if (!foundCustomerPerson) {
            throw new Error('Customer person not found');
          }
        }

        const foundPerson = await this.personRepository.findOneByUuid(person.uuid);
        if (!foundPerson) {
          throw new Error(`Person not found for UUID: ${person.uuid}`);
        }

        const foundOccupation = await this.occupationRepository.findOneByUuid(occupation.uuid);
        if (!foundOccupation) {
          throw new Error(`Occupation not found for UUID: ${occupation.uuid}`);
        }

        return {
          id: foundCustomerPerson?.id || undefined,
          uuid: foundCustomerPerson?.uuid || undefined,
          person: {
            id: foundPerson.id,
            uuid: foundPerson.uuid,
            name: foundPerson.name.getValue(),
          },
          occupation: {
            id: foundOccupation.id,
            uuid: foundOccupation.uuid,
            name: foundOccupation.name,
          },
        };
      }),
    );

    const cropInformation = await Promise.all(
      command.cropInformation?.map(async (cropInfo) => {
        let foundCustomerCropInfo: CustomerCropInformation;

        if (cropInfo.uuid) {
          foundCustomerCropInfo = await this.customerRepository.findCustomerCropInformationByUuid(cropInfo.uuid);

          if (!foundCustomerCropInfo) {
            throw new Error('Customer crop information not found');
          }
        }

        const cultivations = await Promise.all(
          cropInfo.cultivations?.map(async (customerCropInfoCultivation) => {

            let foundCustomerCropInfoCultivation: CustomerCropInformationCultivation;

            if (customerCropInfoCultivation.uuid) {
              foundCustomerCropInfoCultivation = await this.customerRepository.findCustomerCropInfoCultivationByUuid(customerCropInfoCultivation.uuid);

              if (!foundCustomerCropInfoCultivation) {
                throw new Error('Costumer crop information cultivation not found');
              }
            }
            const cultivationUuid = customerCropInfoCultivation.cultivation.uuid;
            const foundCultivation = await this.cultivationRepository.findOneByUuid(cultivationUuid);

            if (!foundCultivation) {
              throw new Error('Cultivation not found');
            }

            return {
              id: foundCustomerCropInfoCultivation?.id,
              uuid: foundCustomerCropInfoCultivation?.uuid,
              customerCropInformationId: foundCustomerCropInfo?.id,
              cultivation: {
                id: foundCultivation.id,
                uuid: foundCultivation.uuid,
                name: foundCultivation.name,
              },
            };
          }),
        );

        return {
          id: foundCustomerCropInfo?.id || undefined,
          uuid: foundCustomerCropInfo?.uuid || undefined,
          typeCrop: cropInfo.typeCrop,
          plantingSeasonStart: cropInfo.plantingSeasonStart,
          plantingSeasonEnd: cropInfo.plantingSeasonEnd,
          harvestSeasonStart: cropInfo.harvestSeasonStart,
          harvestSeasonEnd: cropInfo.harvestSeasonEnd,
          cultivations,
        };
      }),
    );

    const crops = await Promise.all(
      command.crops?.map(async (customerCrop) => {

        let foundCustomerCrop: CustomerCrop;

        if (customerCrop.uuid) {
          foundCustomerCrop = await this.customerRepository.findCustomerCropByUuid(customerCrop.uuid);

          if (!foundCustomerCrop) {
            throw new Error('Customer crop not found');
          }
        }


        const cultivation = await this.cultivationRepository.findOneByUuid(customerCrop.cultivation.uuid);
        if (!cultivation) {
          throw new Error(`Cultivation not found for UUID: ${customerCrop.cultivation.uuid}`);
        }

        const crop = await this.cropRepository.findOneByUuid(customerCrop.crop.uuid);
        if (!crop) {
          throw new Error(`Crop not found for UUID: ${customerCrop.crop.uuid}`);
        }

        return {
          id: foundCustomerCrop?.id || undefined,
          uuid: foundCustomerCrop?.uuid || undefined,
          identification: customerCrop.identification,
          cropStatus: customerCrop.cropStatus,
          description: customerCrop.description,
          plantingDate: customerCrop.plantingDate,
          harvestDate: customerCrop.harvestDate,
          plantedAreaHectares: customerCrop.plantedAreaHectares,
          averageProductivity: customerCrop.averageProductivity,
          conservativeProductivity: customerCrop.conservativeProductivity,
          expectedTotalProduction: customerCrop.expectedTotalProduction,
          nitrogenPercentage: customerCrop.nitrogenPercentage,
          phosphorusPercentage: customerCrop.phosphorusPercentage,
          potassiumPercentage: customerCrop.potassiumPercentage,
          ammoniumSulfatePercentage: customerCrop.ammoniumSulfatePercentage,
          defensivePercentage: customerCrop.defensivePercentage,
          seedPercentage: customerCrop.seedPercentage,
          totalSoldBags: customerCrop.totalSoldBags,
          totalSoldPercentage: customerCrop.totalSoldPercentage,
          averageSalesValue: customerCrop.averageSalesValue,
          cultivation: {
            id: cultivation.id,
            uuid: cultivation.uuid,
            name: cultivation.name,
          },
          crop: {
            id: crop.id,
            uuid: crop.uuid,
            name: crop.name,
          },
        };
      }));


    return { activities, persons, cropInformation, crops };
  }
}
