import { UUID } from 'shared/types/uuid';
import Cpf from 'commons/value-objects/cpf';
import Name from 'commons/value-objects/name';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface PersonProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  name: string,
  cpf: string,
}

export class Person {
  private readonly _id: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _name: Name;
  private readonly _cpf: Cpf;

  constructor(props: PersonProps) {
    this._id = props.id || undefined;
    this._uuid = props.uuid || undefined;
    this._name = new Name(props.name);
    this._cpf = new Cpf(props.cpf);
  }

  public get id(): EntityPrimaryKey {
    return this._id;
  }

  public get uuid(): UUID {
    return this._uuid;
  }

  public get name(): Name {
    return this._name;
  }

  public get cpf(): Cpf {
    return this._cpf;
  }


}
