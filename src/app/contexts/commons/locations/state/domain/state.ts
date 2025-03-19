import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface StateProps {
  id: EntityPrimaryKey;
  uuid: UUID;
  name: string;
  stateCode: string;
}

export class State {
  private readonly _id: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _name: string;
  private readonly _stateCode: string;

  constructor(props: StateProps) {
    this._id = props.id;
    this._uuid = props.uuid;
    this._name = props.name;
    this._stateCode = props.stateCode;
  }

  public get id(): EntityPrimaryKey {
    return this._id;
  }

  public get uuid(): UUID {
    return this._uuid;
  }

  public get name(): string {
    return this._name;
  }

  get stateCode(): string {
    return this._stateCode;
  }
}
