import { UUID } from 'shared/types/uuid';
import {
  GrainConsumer,
  GrainConsumerProps,
} from './value-objects/grain-consumer';
import {
  CustomerLocation,
  CustomerLocationProps,
} from './aggregates/custumer-location';
import {
  CustomerActivity,
  CustomerActivityProps,
} from './aggregates/customer-activity';
import {
  CustomerPerson,
  CustomerPersonProps,
} from './aggregates/customer-person';
import {
  CustomerCropInformation,
  CustomerCropInformationProps,
} from './aggregates/customer-crop-information';
import {
  CustomerCrop,
  CustomerCropProps,
} from 'customer/domain/aggregates/customer-crop';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

interface CustomerProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  identifier: string;
  groupIdentifier?: string;
  description?: string;
  financialTools?: boolean;
  receivesLandRent?: boolean;
  grainConsumer: GrainConsumerProps;
  locations?: CustomerLocationProps[];
  activities?: CustomerActivityProps[];
  persons?: CustomerPersonProps[];
  cropInformation?: CustomerCropInformationProps[];
  crops?: CustomerCropProps[];
}

interface CustomerCreateProps {
  identifier: string;
  groupIdentifier?: string;
  description?: string;
  financialTools?: boolean;
  receivesLandRent?: boolean;
  grainConsumer: GrainConsumerProps;
  locations?: CustomerLocationProps[];
  activities?: CustomerActivityProps[];
  persons?: CustomerPersonProps[];
  cropInformation?: CustomerCropInformationProps[];
  crops?: CustomerCropProps[];
}

export class Customer {
  private readonly _id?: EntityPrimaryKey;
  private readonly _uuid?: UUID;
  private readonly _identifier: string;
  private readonly _groupIdentifier?: string;
  private readonly _description?: string;
  private readonly _financialTools?: boolean;
  private readonly _receivesLandRent?: boolean;
  private readonly _grainConsumer: GrainConsumer;
  private readonly _locations: CustomerLocation[];
  private readonly _activities: CustomerActivity[];
  private readonly _persons: CustomerPerson[];
  private readonly _cropInformation: CustomerCropInformation[];
  private readonly _crops: CustomerCrop[];

  constructor(props: CustomerProps) {
    this._id = props.id;
    this._uuid = props.uuid;
    this._identifier = props.identifier;
    this._groupIdentifier = props.groupIdentifier;
    this._description = props.description;
    this._financialTools = props.financialTools;
    this._receivesLandRent = props.receivesLandRent;

    this._grainConsumer = GrainConsumer.create(props.grainConsumer);
    this._locations = props.locations?.map(loc => new CustomerLocation(loc)) ?? [];
    this._activities = props.activities?.map(act => new CustomerActivity(act)) ?? [];
    this._persons = props.persons?.map(per => new CustomerPerson(per)) ?? [];
    this._cropInformation = props.cropInformation?.map(cropInformation => new CustomerCropInformation(cropInformation)) ?? [];
    this._crops = props.crops?.map(crop => new CustomerCrop(crop)) ?? [];
  }

  static create(props: CustomerCreateProps,
  ) {
    return new Customer({
      ...props,
    });
  }

  get id(): EntityPrimaryKey | undefined {
    return this._id;
  }

  get uuid(): UUID | undefined {
    return this._uuid;
  }

  get identifier(): string {
    return this._identifier;
  }

  get groupIdentifier(): string | undefined {
    return this._groupIdentifier;
  }

  get description(): string | undefined {
    return this._description;
  }

  get financialTools(): boolean | undefined {
    return this._financialTools;
  }

  get receivesLandRent(): boolean | undefined {
    return this._receivesLandRent;
  }

  get grainConsumer(): GrainConsumer {
    return this._grainConsumer;
  }

  get isGrainConsumer(): boolean {
    return this._grainConsumer.isConsumer;
  }

  get isOwnGrain(): boolean {
    return this._grainConsumer.isOwnGrain;
  }

  get isReceiveThirdGrains(): boolean {
    return this._grainConsumer.isReceiveThirdGrains;
  }

  get annualQuantity(): number {
    return this._grainConsumer.annualQuantity;
  }

  get locations(): CustomerLocation[] {
    return this._locations;
  }

  get activities(): CustomerActivity[] {
    return this._activities;
  }

  get persons(): CustomerPerson[] {
    return this._persons;
  }

  get cropInformation(): CustomerCropInformation[] {
    return this._cropInformation;
  }

  get crops(): readonly CustomerCrop[] {
    return this._crops;
  }

}
