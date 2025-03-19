import { Customer } from 'customer/domain/customer';
import {
  Output,
} from 'customer/application/use-cases/create/create-customer-output.type';

export class CreateCustomerOutputAdapter {
  static execute(customerSaved: Customer): Output {
    return {
      uuid: customerSaved.uuid,
      identifier: customerSaved.identifier,
      groupIdentifier: customerSaved.groupIdentifier,
      description: customerSaved.description,
      financialTools: customerSaved.financialTools,
      receivesLandRent: customerSaved.receivesLandRent,
      grainConsumer: {
        isConsumer: customerSaved.grainConsumer.isConsumer,
        isOwnGrain: customerSaved.grainConsumer.isOwnGrain,
        isReceiveThirdGrains: customerSaved.grainConsumer.isReceiveThirdGrains,
        annualQuantity: customerSaved.grainConsumer.annualQuantity,
      },
      locations: customerSaved.locations.map(location => ({
        uuid: location.uuid,
        name: location.name,
        description: location.description,
        address: location.address,
        coordinates: location.coordinates
          ? { lat: location.coordinates.lat, long: location.coordinates.long }
          : undefined,
        totalHectares: location.totalHectares,
      })),
      activities: customerSaved.activities.map(activity => ({
        uuid: activity.uuid,
        activity: {
          uuid: activity.activity.uuid,
          name: activity.activity.name,
        },
      })),
      persons: customerSaved.persons.map(person => ({
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
      cropInformation: customerSaved.cropInformation.map(info => ({
        uuid: info.uuid,
        typeCrop: info.typeCrop,
        plantingSeasonStart: info.plantingSeasonStart,
        plantingSeasonEnd: info.plantingSeasonEnd,
        harvestSeasonStart: info.harvestSeasonStart,
        harvestSeasonEnd: info.harvestSeasonEnd,
        cultivations: info.cultivations.map(customerCropInfoCultivation => ({
          uuid: customerCropInfoCultivation.uuid,
          cultivation: {
            uuid: customerCropInfoCultivation.cultivation.uuid,
            name: customerCropInfoCultivation.cultivation.name,
          },
        })),
      })),
      crops: customerSaved.crops.map(crop => ({
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
