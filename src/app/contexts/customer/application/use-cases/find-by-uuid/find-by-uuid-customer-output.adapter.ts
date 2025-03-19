import { Customer } from 'customer/domain/customer';
import {
  Output,
} from 'customer/application/use-cases/create/create-customer-output.type';

export class FindByUuidCustomerOutputAdapter {
  static execute(customer: Customer): Output {
    return {
      uuid: customer.uuid,
      identifier: customer.identifier,
      groupIdentifier: customer.groupIdentifier,
      description: customer.description,
      financialTools: customer.financialTools,
      receivesLandRent: customer.receivesLandRent,
      grainConsumer: {
        isConsumer: customer.grainConsumer.isConsumer,
        isOwnGrain: customer.grainConsumer.isOwnGrain,
        isReceiveThirdGrains: customer.grainConsumer.isReceiveThirdGrains,
        annualQuantity: customer.grainConsumer.annualQuantity,
      },
      locations: customer.locations.map(location => ({
        uuid: location.uuid,
        name: location.name,
        description: location.description,
        address: location.address,
        coordinates: location.coordinates
          ? { lat: location.coordinates.lat, long: location.coordinates.long }
          : undefined,
        totalHectares: location.totalHectares,
      })),
      activities: customer.activities.map(customerActivity => ({
        uuid: customerActivity.uuid,
        activity: {
          uuid: customerActivity.activity.uuid,
          name: customerActivity.activity.name,
        },
      })),
      persons: customer.persons.map(person => ({
        uuid: person.uuid,
        person: {
          uuid: person.person.uuid,
          name: person.person.name,
        },
        occupation: {
          uuid: person.occupation.uuid,
          name: person.occupation.name,
        },
      })),
      cropInformation: customer.cropInformation.map(info => ({
        uuid: info.uuid,
        typeCrop: info.typeCrop,
        plantingSeasonStart: info.plantingSeasonStart,
        plantingSeasonEnd: info.plantingSeasonEnd,
        harvestSeasonStart: info.harvestSeasonStart,
        harvestSeasonEnd: info.harvestSeasonEnd,
        cultivations: info.cultivations.map(customerCropInfoCultivation => ({
          uuid: customerCropInfoCultivation.uuid,
          cultivation: {
            uuid: customerCropInfoCultivation.cultivation?.uuid,
            name: customerCropInfoCultivation.cultivation?.name,
          },
        })),
      })),
      crops: customer.crops.map(crop => ({
        uuid: crop.uuid,
        identification: crop.identification,
        cropStatus: crop.cropStatus,
        cultivation: {
          uuid: crop.cultivation.uuid,
          name: crop.cultivation.name,
        },
        description: crop.description,
        plantingDate: crop.plantingDate,
        harvestDate: crop.harvestDate,
        plantedAreaHectares: crop.plantedAreaHectares,
        averageProductivity: crop.averageProductivity,
        conservativeProductivity: crop.conservativeProductivity,
        expectedTotalProduction: crop.expectedTotalProduction,
        nitrogenPercentage: crop.nitrogenPercentage,
        phosphorusPercentage: crop.phosphorusPercentage,
        potassiumPercentage: crop.potassiumPercentage,
        ammoniumSulfatePercentage: crop.ammoniumSulfatePercentage,
        defensivePercentage: crop.defensivePercentage,
        seedPercentage: crop.seedPercentage,
        totalSoldBags: crop.totalSoldBags,
        totalSoldPercentage: crop.totalSoldPercentage,
        averageSalesValue: crop.averageSalesValue,
        crop: {
          uuid: crop.crop.uuid,
          name: crop.crop.name,
        },
      })),
    };
  }
}
