import { Customer } from 'customer/domain/customer';
import {
  CustomerEntity,
} from 'customer/infrastructure/entities/customer.entity';

export class ToDomainAdapter {
  static execute(entity: CustomerEntity): Customer {
    if (!entity) return null;

    const hasCoordinates = (latitude, longitude) => {
      return !!latitude && !!longitude;
    };

    return new Customer({
      id: entity.id,
      uuid: entity.uuid,
      identifier: entity.identifier,
      groupIdentifier: entity.groupIdentifier,
      description: entity.description,
      financialTools: entity.financialTools,
      receivesLandRent: entity.receivesLandRent,
      grainConsumer: {
        isConsumer: entity.grainConsumer,
        isOwnGrain: entity.ownGrain,
        isReceiveThirdGrains: entity.receiveThirdGrains,
        annualQuantity: Number(entity.annualQuantity),
      },
      locations: entity.locations?.map((location) => ({
        id: location.id,
        uuid: location.uuid,
        customerId: entity.id,
        name: location.name,
        description: location.description,
        address: location.address,
        coordinates: hasCoordinates(location.latitude, location.longitude) ? {
          lat: Number(location.latitude),
          long: Number(location.longitude),
        } : undefined,
        totalHectares: Number(location.totalHectares),
      })) || [],
      persons: entity.persons?.map((person) => ({
        id: person.id,
        uuid: person.uuid,
        customerId: entity.id,
        person: person.person,
        occupation: person.occupation,
      })) || [],
      activities: entity.activities?.map((activity) => ({
        id: activity.id,
        uuid: activity.uuid,
        customerId: entity.id,
        activity: activity.activity,
      })) || [],
      cropInformation: entity.cropInformation?.map((cropInfo) => ({
        id: cropInfo.id,
        uuid: cropInfo.uuid,
        customerId: entity.id,
        typeCrop: cropInfo.typeCrop,
        plantingSeasonStart: cropInfo.plantingSeasonStart,
        plantingSeasonEnd: cropInfo.plantingSeasonEnd,
        harvestSeasonStart: cropInfo.harvestSeasonStart,
        harvestSeasonEnd: cropInfo.harvestSeasonEnd,
        cultivations: cropInfo.cultivations?.map((customerCropInfoCultivation) => ({
          id: customerCropInfoCultivation.id,
          uuid: customerCropInfoCultivation.uuid,
          cultivation: {
            id: customerCropInfoCultivation.cultivation?.id,
            uuid: customerCropInfoCultivation.cultivation?.uuid,
            name: customerCropInfoCultivation.cultivation?.name,
            description: customerCropInfoCultivation.cultivation?.description,
          },
        })) || [],
      })) || [],
      crops: entity.crops?.map((crop) => ({
        id: crop.id,
        uuid: crop.uuid,
        customerId: entity.id,
        identification: crop.identification,
        cropStatus: crop.status,
        description: crop.description,
        plantingDate: crop.plantingDate,
        harvestDate: crop.harvestDate,
        plantedAreaHectares: Number(crop.plantedAreaHectares),
        averageProductivity: Number(crop.averageProductivity),
        conservativeProductivity: Number(crop.conservativeProductivity),
        expectedTotalProduction: Number(crop.expectedTotalProduction),
        nitrogenPercentage: Number(crop.nitrogenPercentage),
        phosphorusPercentage: Number(crop.phosphorusPercentage),
        potassiumPercentage: Number(crop.potassiumPercentage),
        ammoniumSulfatePercentage: Number(crop.ammoniumSulfatePercentage),
        defensivePercentage: Number(crop.defensivePercentage),
        seedPercentage: Number(crop.seedPercentage),
        totalSoldBags: Number(crop.totalSoldBags),
        totalSoldPercentage: Number(crop.totalSoldPercentage),
        averageSalesValue: Number(crop.averageSalesValue),

        cultivation: crop.cultivation,
        crop: crop.crop,
        locations: crop.locations?.map((loc) => ({
          id: loc.id,
          uuid: loc.uuid,
          name: loc.name,
        })) || [],
      })) || [],
    });
  }
}
