import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface CropLocationProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  customerId?: number;
  name: string;
}

export class CropLocation {
  private readonly _id?: EntityPrimaryKey;
  private readonly _uuid?: UUID;
  private readonly _customerId?: number;
  private readonly _name: string;


  constructor(props: CropLocationProps) {
    this._id = props.id;
    this._uuid = props.uuid;
    this._customerId = props.customerId;
    this._name = props.name;

  }

  get id(): EntityPrimaryKey {
    return this._id;
  }

  get uuid(): UUID {
    return this._uuid;
  }

  get customerId(): number {
    return this._customerId;
  }

  get name(): string {
    return this._name;
  }

}
