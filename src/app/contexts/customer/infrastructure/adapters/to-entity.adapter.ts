import { Customer } from 'customer/domain/customer';
import {
  CustomerEntity,
} from 'customer/infrastructure/entities/customer.entity';
import {
  CustomerLocationEntity,
} from 'customer/infrastructure/entities/customer-location.entity';
import {
  CustomerPersonEntity,
} from 'customer/infrastructure/entities/customer-person.entity';
import { PersonEntity } from 'person/infrastructure/person.entity';
import { OccupationEntity } from 'occupation/infrastructure/occupation.entity';
import {
  CustomerActivityEntity,
} from 'customer/infrastructure/entities/customer-activity.entity';
import { ActivityEntity } from 'activity/infrastructure/activity.entity';
import {
  CustomerCropInformationEntity,
} from 'customer/infrastructure/entities/customer-crop-information.entity';
import {
  CustomerCropInformationCultivationEntity,
} from 'customer/infrastructure/entities/customer-crop-information-cultivation.entity';
import {
  CultivationEntity,
} from 'commons/cultivations/infrastructure/cultivation.entity';
import {
  CustomerCropEntity,
} from 'customer/infrastructure/entities/customer-crop.entity';
import { CropEntity } from 'commons/crop/infrastructure/crop.entity';

export class ToEntityAdapter {
  static execute(domain: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.id = domain.id;
    entity.uuid = domain.uuid;
    entity.identifier = domain.identifier;
    entity.groupIdentifier = domain.groupIdentifier;
    entity.description = domain.description;
    entity.financialTools = domain.financialTools;
    entity.receivesLandRent = domain.receivesLandRent;
    entity.grainConsumer = domain.grainConsumer.isConsumer;
    entity.ownGrain = domain.grainConsumer.isOwnGrain;
    entity.annualQuantity = domain.grainConsumer.annualQuantity;
    entity.receiveThirdGrains = domain.grainConsumer.isReceiveThirdGrains;

    // Convertendo Locations (OneToMany)
    entity.locations = domain.locations.map(location => {
      const locationEntity = new CustomerLocationEntity();
      locationEntity.id = location.id;
      locationEntity.uuid = location.uuid;
      locationEntity.customer = entity;
      locationEntity.name = location.name;
      locationEntity.description = location.description;
      locationEntity.address = location.address;
      locationEntity.latitude = location.coordinates?.lat;
      locationEntity.longitude = location.coordinates?.long;
      locationEntity.totalHectares = location.totalHectares;
      return locationEntity;
    });

    // Convertendo Pessoas (OneToMany)
    entity.persons = domain.persons.map(person => {
      const personEntity = new CustomerPersonEntity();
      personEntity.id = person.id;
      personEntity.uuid = person.uuid;
      personEntity.customer = entity;
      personEntity.person = {
        id: person.person.id,
      } as PersonEntity;
      personEntity.occupation = {
        id: person.occupation.id,
      } as OccupationEntity;
      return personEntity;
    });

    // Convertendo Atividades (OneToMany)
    entity.activities = domain.activities.map(activity => {
      const activityEntity = new CustomerActivityEntity();
      activityEntity.id = activity.id;
      activityEntity.uuid = activity.uuid;
      activityEntity.customer = entity;
      activityEntity.activity = {
        id: activity.activity.id,
      } as ActivityEntity;
      return activityEntity;
    });

    // Convertendo Informações de Cultivo (OneToMany)
    entity.cropInformation = domain.cropInformation.map(cropInfo => {
      const cropInfoEntity = new CustomerCropInformationEntity();
      cropInfoEntity.id = cropInfo.id;
      cropInfoEntity.uuid = cropInfo.uuid;
      cropInfoEntity.customer = entity;
      cropInfoEntity.typeCrop = cropInfo.typeCrop;
      cropInfoEntity.plantingSeasonStart = cropInfo.plantingSeasonStart;
      cropInfoEntity.plantingSeasonEnd = cropInfo.plantingSeasonEnd;
      cropInfoEntity.harvestSeasonStart = cropInfo.harvestSeasonStart;
      cropInfoEntity.harvestSeasonEnd = cropInfo.harvestSeasonEnd;

      cropInfoEntity.cultivations = cropInfo.cultivations.map(CustomerCropInfoCultivation => {
        const infoCultivation = new CustomerCropInformationCultivationEntity();
        infoCultivation.id = CustomerCropInfoCultivation.id;
        infoCultivation.uuid = CustomerCropInfoCultivation.uuid;

        infoCultivation.customerCropInformation = cropInfoEntity;

        const cultivation = CustomerCropInfoCultivation.cultivation;
        infoCultivation.cultivation = {
          id: cultivation?.id,
          uuid: cultivation?.uuid,
        } as CultivationEntity;

        return infoCultivation;
      });

      return cropInfoEntity;
    });

    // Convertendo Safras (OneToMany)
    entity.crops = domain.crops.map(customerCrop => {
      const customerCropEntity = new CustomerCropEntity();
      customerCropEntity.id = customerCrop.id;
      customerCropEntity.uuid = customerCrop.uuid;
      customerCropEntity.customer = entity;
      customerCropEntity.identification = customerCrop.identification;
      customerCropEntity.status = customerCrop.cropStatus;
      customerCropEntity.description = customerCrop.description;
      customerCropEntity.plantingDate = customerCrop.plantingDate;
      customerCropEntity.harvestDate = customerCrop.harvestDate;
      customerCropEntity.plantedAreaHectares = customerCrop.plantedAreaHectares;
      customerCropEntity.averageProductivity = customerCrop.averageProductivity;
      customerCropEntity.conservativeProductivity = customerCrop.conservativeProductivity;
      customerCropEntity.expectedTotalProduction = customerCrop.expectedTotalProduction;
      customerCropEntity.nitrogenPercentage = customerCrop.nitrogenPercentage;
      customerCropEntity.phosphorusPercentage = customerCrop.phosphorusPercentage;
      customerCropEntity.potassiumPercentage = customerCrop.potassiumPercentage;
      customerCropEntity.ammoniumSulfatePercentage = customerCrop.ammoniumSulfatePercentage;
      customerCropEntity.defensivePercentage = customerCrop.defensivePercentage;
      customerCropEntity.seedPercentage = customerCrop.seedPercentage;
      customerCropEntity.totalSoldBags = customerCrop.totalSoldBags;
      customerCropEntity.totalSoldPercentage = customerCrop.totalSoldPercentage;
      customerCropEntity.averageSalesValue = customerCrop.averageSalesValue;

      customerCropEntity.crop = {
        id: customerCrop.crop.id,
      } as CropEntity;

      customerCropEntity.cultivation = {
        id: customerCrop.cultivation.id,
      } as CultivationEntity;

      customerCropEntity.locations = customerCrop.locations.map(cropLoc => {
        return {
          id: cropLoc.id,
        } as CustomerLocationEntity;
      });

      return customerCropEntity;
    });

    return entity;
  }
}
