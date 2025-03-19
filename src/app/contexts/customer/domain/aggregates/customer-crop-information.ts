import { UUID } from 'shared/types/uuid';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';
import {
  CustomerCropInformationCultivation,
  CustomerCropInformationCultivationProps,
} from 'customer/domain/aggregates/customer-crop-information-cultivation';

export interface CustomerCropInformationProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  customerId?: EntityPrimaryKey;
  typeCrop: CropTypeEnum;
  plantingSeasonStart: Date;
  plantingSeasonEnd: Date;
  harvestSeasonStart: Date;
  harvestSeasonEnd: Date;
  cultivations: CustomerCropInformationCultivationProps[];
}

export class CustomerCropInformation {
  private readonly _id?: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _customerId?: EntityPrimaryKey;
  private readonly _typeCrop: CropTypeEnum;
  private readonly _plantingSeasonStart: Date;
  private readonly _plantingSeasonEnd: Date;
  private readonly _harvestSeasonStart: Date;
  private readonly _harvestSeasonEnd: Date;
  private readonly _cultivations: CustomerCropInformationCultivation[];

  constructor(props: CustomerCropInformationProps) {
    this._id = props.id;
    this._uuid = props.uuid;
    this._customerId = props.customerId;
    this._typeCrop = props.typeCrop;
    this._plantingSeasonStart = props.plantingSeasonStart;
    this._plantingSeasonEnd = props.plantingSeasonEnd;
    this._harvestSeasonStart = props.harvestSeasonStart;
    this._harvestSeasonEnd = props.harvestSeasonEnd;

    this._cultivations = props.cultivations ? props.cultivations.map(cultivation => new CustomerCropInformationCultivation(cultivation)) : [];

    if (this._plantingSeasonStart > this._plantingSeasonEnd) {
      throw new Error('A data de início do plantio não pode ser posterior à data de término.');
    }
    if (this._harvestSeasonStart > this._harvestSeasonEnd) {
      throw new Error('A data de início da colheita não pode ser posterior à data de término.');
    }
    if (this._plantingSeasonEnd > this._harvestSeasonStart) {
      throw new Error('A data de término do plantio não pode ser posterior à data de início da colheita.');
    }
  }

  get id(): EntityPrimaryKey | undefined {
    return this._id;
  }

  get uuid(): UUID {
    return this._uuid;
  }

  get customerId(): EntityPrimaryKey {
    return this._customerId;
  }

  get typeCrop(): CropTypeEnum {
    return this._typeCrop;
  }

  get plantingSeasonStart(): Date {
    return this._plantingSeasonStart;
  }

  get plantingSeasonEnd(): Date {
    return this._plantingSeasonEnd;
  }

  get harvestSeasonStart(): Date {
    return this._harvestSeasonStart;
  }

  get harvestSeasonEnd(): Date {
    return this._harvestSeasonEnd;
  }

  get cultivations(): CustomerCropInformationCultivation[] {
    return this._cultivations;
  }
}
