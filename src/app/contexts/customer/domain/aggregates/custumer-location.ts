import { UUID } from 'shared/types/uuid';
import { GeoCoordinates } from '../value-objects/geo-coordinates';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface CustomerLocationProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  customerId?: EntityPrimaryKey;
  name: string;
  description?: string;
  address?: string;
  coordinates?: {
    lat: number;
    long: number;
  };
  totalHectares?: number;
}

export class CustomerLocation {
  private readonly _id?: EntityPrimaryKey;
  private readonly _uuid?: UUID;
  private readonly _customerId?: EntityPrimaryKey;
  private readonly _name: string;
  private readonly _description?: string;
  private readonly _address?: string;
  private readonly _coordinates?: GeoCoordinates;
  private readonly _totalHectares?: number;


  constructor(props: CustomerLocationProps) {
    this._id = props.id;
    this._uuid = props.uuid;
    this._customerId = props.customerId;
    this._name = props.name;
    this._description = props.description;
    this._address = props.address;
    this._totalHectares = props.totalHectares;

    this._coordinates = props.coordinates ? new GeoCoordinates({
      lat: props.coordinates?.lat,
      long: props.coordinates?.long,
    }) : undefined

  }

  get id(): EntityPrimaryKey | undefined {
    return this._id;
  }

  get uuid(): UUID | undefined {
    return this._uuid;
  }

  get customerId(): EntityPrimaryKey {
    return this._customerId;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get address(): string {
    return this._address;
  }

  get coordinates(): GeoCoordinates {
    return this._coordinates;
  }

  get lat(): number {
    return this._coordinates.lat;
  }

  get long(): number {
    return this._coordinates.long;
  }

  get totalHectares(): number | undefined{
    return this._totalHectares;
  }

}
