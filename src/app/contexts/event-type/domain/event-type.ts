import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface EventTypeProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  name: string,
  description?: string,
}

export class EventType {
  private readonly _id: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _name: string;
  private readonly _description: string;

  constructor(props: EventTypeProps) {
    this._id = props.id || undefined;
    this._uuid = props.uuid || undefined;
    this._name = props.name;
    this._description = props.description;

  }

  static create(
    name: string,
    description?: string,
  ) {
    return new EventType({
      name,
      description,
    });
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
