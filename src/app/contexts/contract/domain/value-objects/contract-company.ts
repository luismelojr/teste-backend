import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface ContractCompanyProps {
  id: EntityPrimaryKey;
  uuid: UUID;
  name: string;
  cnpj?: string;
}

export class ContractCompany {
  private readonly _id: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _name: string;
  private readonly _cnpj?: string;

  constructor(props: ContractCompanyProps) {
    this._id = props.id;
    this._uuid = props.uuid;
    this._name = props.name;
    this._cnpj = props.cnpj;
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

  get cnpj(): string | undefined {
    return this._cnpj;
  }
}
