import { UUID } from 'shared/types/uuid';
import { State } from '../../state/domain/state';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface CityProps {
  id: EntityPrimaryKey;
  uuid: UUID;
  name: string;
  state: State;
}

export class City {
  private readonly _id: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _name: string;
  private readonly _state: State;

  constructor(props: CityProps) {
    this._id = props.id;
    this._uuid = props.uuid;
    this._name = props.name;
    this._state = props.state;
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

  get state(): State {
    return this._state;
  }
}
