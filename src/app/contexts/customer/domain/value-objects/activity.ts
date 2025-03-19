import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface ActivityProps {
  id: EntityPrimaryKey;
  uuid: UUID;
  name: string;
  description?: string;
}

export class Activity {
  private readonly _id: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _name: string;
  private readonly _description?: string;

  constructor(props: ActivityProps) {
    this._id = props.id;
    this._uuid = props.uuid;
    this._name = props.name;
    this._description = props.description;
  }

  get id(): EntityPrimaryKey {
    return this._id;
  }

  get uuid(): UUID {
    return this._uuid;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }
}
