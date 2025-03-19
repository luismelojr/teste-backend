import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface PlanFunctionsProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  name: string,
  description?: string,
}

export class PlanFunctions {
  private _id: EntityPrimaryKey;
  private _uuid: UUID;
  private _name: string;
  private _description: string;

  constructor(props: PlanFunctionsProps) {
    if (!props.name) throw 'name is required';

    this._id = props.id || undefined;
    this._uuid = props.uuid || undefined;
    this._name = props.name;
    this._description = props.description;
  }

  static create(
    name: string,
    description?: string,
  ) {
    return new PlanFunctions({
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
