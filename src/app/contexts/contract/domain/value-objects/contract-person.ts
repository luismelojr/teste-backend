import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface ContractPersonProps {
  id: EntityPrimaryKey;
  uuid: UUID;
  name: string;
  cpf?: string;
}

export class ContractPerson {
  private readonly _id: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _name: string;
  private readonly _cpf?: string;

  constructor(props: ContractPersonProps) {
    this._id = props.id;
    this._uuid = props.uuid;
    this._name = props.name;
    this._cpf = props.cpf;
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

  get cpf(): string | undefined {
    return this._cpf;
  }
}
