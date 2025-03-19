import { UUID } from 'shared/types/uuid';
import { CropCustomerStatusEnum } from 'enumerates/crop-customer-status.enum';
import {
  Cultivation,
  CultivationProps,
} from 'customer/domain/value-objects/cultivation';
import { Crop, CropProps } from 'customer/domain/value-objects/crop';
import {
  CropLocation,
  CropLocationProps,
} from 'customer/domain/value-objects/crop-location';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';


export interface CustomerCropProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  customerId?: EntityPrimaryKey;
  identification: string;
  cropStatus: CropCustomerStatusEnum;
  cultivation: CultivationProps;
  description?: string;
  plantingDate?: Date;
  harvestDate?: Date;
  plantedAreaHectares?: number;
  averageProductivity?: number;
  conservativeProductivity?: number;
  expectedTotalProduction?: number;
  nitrogenPercentage?: number;
  phosphorusPercentage?: number;
  potassiumPercentage?: number;
  ammoniumSulfatePercentage?: number;
  defensivePercentage?: number;
  seedPercentage?: number;
  totalSoldBags?: number;
  totalSoldPercentage?: number;
  averageSalesValue?: number;
  crop?: CropProps;
  locations?: CropLocationProps[];
}

export class CustomerCrop {
  private readonly _id?: EntityPrimaryKey;
  private readonly _uuid?: UUID;
  private readonly _customerId?: EntityPrimaryKey;
  private readonly _identification: string;
  private readonly _cropStatus: CropCustomerStatusEnum;
  private readonly _cultivation?: Cultivation;
  private readonly _description?: string;
  private readonly _plantingDate?: Date;
  private readonly _harvestDate?: Date;
  private readonly _plantedAreaHectares?: number;
  private readonly _averageProductivity?: number;
  private readonly _conservativeProductivity?: number;
  private readonly _expectedTotalProduction?: number;
  private readonly _nitrogenPercentage?: number;
  private readonly _phosphorusPercentage?: number;
  private readonly _potassiumPercentage?: number;
  private readonly _ammoniumSulfatePercentage?: number;
  private readonly _defensivePercentage?: number;
  private readonly _seedPercentage?: number;
  private readonly _totalSoldBags?: number;
  private readonly _totalSoldPercentage?: number;
  private readonly _averageSalesValue?: number;
  private readonly _crop?: Crop;
  private readonly _locations?: CropLocation[];

  constructor(props: CustomerCropProps) {
    if (props.plantingDate >= props.harvestDate) {
      throw new Error('Planting date must be before harvest date.');
    }

    this._id = props.id;
    this._uuid = props.uuid;
    this._customerId = props.customerId;
    this._identification = props.identification;
    this._description = props.description;
    this._plantingDate = props.plantingDate;
    this._harvestDate = props.harvestDate;
    this._plantedAreaHectares = props.plantedAreaHectares;
    this._averageProductivity = props.averageProductivity;
    this._conservativeProductivity = props.conservativeProductivity;
    this._expectedTotalProduction = props.expectedTotalProduction;
    this._nitrogenPercentage = props.nitrogenPercentage;
    this._phosphorusPercentage = props.phosphorusPercentage;
    this._potassiumPercentage = props.potassiumPercentage;
    this._ammoniumSulfatePercentage = props.ammoniumSulfatePercentage;
    this._defensivePercentage = props.defensivePercentage;
    this._seedPercentage = props.seedPercentage;
    this._totalSoldBags = props.totalSoldBags;
    this._totalSoldPercentage = props.totalSoldPercentage;
    this._averageSalesValue = props.averageSalesValue;
    this._cropStatus = props.cropStatus;
    this._cultivation = new Cultivation(props.cultivation);
    this._crop = new Crop(props.crop);

    this._locations = props.locations?.map(loc => new CropLocation(loc)) ?? [];
  }


  get id(): EntityPrimaryKey {
    return this._id;
  }

  get uuid(): UUID {
    return this._uuid;
  }

  get identification(): string {
    return this._identification;
  }

  get description(): string {
    return this._description;
  }

  get plantingDate(): Date {
    return this._plantingDate;
  }

  get harvestDate(): Date {
    return this._harvestDate;
  }

  get plantedAreaHectares(): number {
    return this._plantedAreaHectares;
  }

  get averageProductivity(): number {
    return this._averageProductivity;
  }

  get conservativeProductivity(): number {
    return this._conservativeProductivity;
  }

  get expectedTotalProduction(): number {
    return this._expectedTotalProduction;
  }

  get nitrogenPercentage(): number {
    return this._nitrogenPercentage;
  }

  get phosphorusPercentage(): number {
    return this._phosphorusPercentage;
  }

  get potassiumPercentage(): number {
    return this._potassiumPercentage;
  }

  get ammoniumSulfatePercentage(): number {
    return this._ammoniumSulfatePercentage;
  }

  get defensivePercentage(): number {
    return this._defensivePercentage;
  }

  get seedPercentage(): number {
    return this._seedPercentage;
  }

  get totalSoldBags(): number {
    return this._totalSoldBags;
  }

  get totalSoldPercentage(): number {
    return this._totalSoldPercentage;
  }

  get averageSalesValue(): number {
    return this._averageSalesValue;
  }

  get cropStatus(): CropCustomerStatusEnum {
    return this._cropStatus;
  }

  get customerId(): EntityPrimaryKey {
    return this._customerId;
  }

  get cultivation(): Cultivation {
    return this._cultivation;
  }

  get crop(): Crop {
    return this._crop;
  }

  get locations(): CropLocation[] {
    return this._locations;
  }
}
